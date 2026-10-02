import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import axios from "axios";
import * as tus from "tus-js-client";
import {
  FiSave, FiX, FiUpload, FiFile, FiTrash2,
  FiCheckCircle, FiAlertCircle, FiVideo, FiLoader,
} from "react-icons/fi";
import { API_URL } from "../../store/authStore";
import { toast } from "react-hot-toast";

const BUNNY_LIBRARY_ID = "767030";

const VideoForm = () => {
  const { courseId, slug, moduleId, videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAdmin = location.pathname.startsWith('/admin');
  const apiBasePath = isAdmin 
    ? `admin/courses/${courseId}/modules/${moduleId}` 
    : `instructor/courses/${slug}/modules/${moduleId}`;
    
  const returnUrl = isAdmin 
    ? `/admin/courses/${courseId}/modules/${moduleId}` 
    : `/instructor/courses/${slug}/modules`;

  const isEditMode = !!videoId;
  const fileInputRef = useRef(null);
  const tusUploadRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    isFree: false,
    isPublished: false,
    description: "",
    order: 0,
  });

  // Bunny upload state
  const [uploadState, setUploadState] = useState("idle"); // idle | creating | uploading | done | error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bunnyVideoId, setBunnyVideoId] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch existing video data in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/${apiBasePath}/video/${videoId}`
        );
        setFormData({
          title: data.data.title || "",
          isFree: data.data.isFree || false,
          isPublished: data.data.isPublished || false,
          description: data.data.description || "",
          order: data.data.order || 0,
        });
        setBunnyVideoId(data.data.videoId || "");
        if (data.data.videoId) setUploadState("done");
        if (data.data.files) setAttachedFiles(data.data.files);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video data");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchVideo();
  }, [apiBasePath, videoId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  // Step 1 & 2: Create Bunny entry then upload via TUS
  const handleVideoFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!formData.title.trim()) {
      toast.error("Please enter a video title first.");
      e.target.value = null;
      return;
    }

    if (!apiBasePath) {
      toast.error("Navigation error: missing identifiers.");
      setError(`Route params missing.`);
      return;
    }

    setSelectedFile(file);
    setUploadState("creating");
    setError("");

    try {
      // Step 1: Create a video entry in Bunny.net via our backend
      const entryRes = await axios.post(
        `${API_URL}/${apiBasePath}/video/create-entry`,
        { title: formData.title }
      );

      const { videoId: newBunnyVideoId, uploadSignature, expireTime } = entryRes.data.data;
      setBunnyVideoId(newBunnyVideoId);

      // Step 2: Upload the file directly to Bunny.net via TUS
      setUploadState("uploading");
      setUploadProgress(0);

      await new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: "https://video.bunnycdn.com/tusupload",
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            AuthorizationSignature: uploadSignature,
            AuthorizationExpire: expireTime,
            VideoId: newBunnyVideoId,
            LibraryId: BUNNY_LIBRARY_ID,
          },
          metadata: {
            filetype: file.type,
            title: formData.title,
          },
          onError: (err) => {
            console.error("TUS upload error:", err);
            reject(err);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const pct = Math.round((bytesUploaded / bytesTotal) * 100);
            setUploadProgress(pct);
          },
          onSuccess: () => {
            resolve();
          },
        });

        tusUploadRef.current = upload;
        upload.findPreviousUploads().then((prev) => {
          if (prev.length) upload.resumeFromPreviousUpload(prev[0]);
          upload.start();
        });
      });

      setUploadState("done");
      toast.success("Video uploaded to Bunny.net successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadState("error");
      setError("Video upload to Bunny.net failed. Please try again.");
      toast.error("Video upload failed.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const cancelUpload = () => {
    if (tusUploadRef.current) tusUploadRef.current.abort();
    setUploadState("idle");
    setUploadProgress(0);
    setSelectedFile(null);
    setBunnyVideoId("");
  };

  // Step 3: Save the video record to our database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isEditMode && !bunnyVideoId) {
      setError("Please upload a video file before saving.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        isFree: formData.isFree,
        isPublished: formData.isPublished,
        description: formData.description,
        order: formData.order,
        ...(bunnyVideoId && { videoId: bunnyVideoId }),
      };

      if (isEditMode) {
        await axios.put(
          `${API_URL}/${apiBasePath}/video/${videoId}`,
          payload
        );
      } else {
        await axios.post(
          `${API_URL}/${apiBasePath}/video`,
          payload
        );
      }

      toast.success(isEditMode ? "Video updated successfully!" : "Video saved successfully!");
      navigate(returnUrl);
    } catch (err) {
      console.error("Error saving video:", err);
      setError(err.response?.data?.message || "Failed to save video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Attachment file upload (R2)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const presignedRes = await axios.get(
        `${API_URL}/upload/presigned-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`
      );
      const { url, key } = presignedRes.data.data;
      const CUSTOM_DOMAIN = "https://files.hippocampus-academy.com";
      const fileUrlToSave = `${CUSTOM_DOMAIN}/${encodeURIComponent(key || file.name)}`;

      await axios.put(url, file, {
        withCredentials: false,
        headers: { "Content-Type": file.type },
      });
      await axios.post(
        `${API_URL}/${apiBasePath}/video/${videoId}/file`,
        { name: file.name, url: fileUrlToSave, type: file.type }
      );
      toast.success("File uploaded successfully");
      const { data } = await axios.get(
        `${API_URL}/${apiBasePath}/video/${videoId}`
      );
      if (data.data.files) setAttachedFiles(data.data.files);
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(false);
      e.target.value = null;
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(
        `${API_URL}/${apiBasePath}/video/${videoId}/file/${fileId}`
      );
      toast.success("File deleted successfully");
      setAttachedFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error("Failed to delete file");
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );
  }

  const uploadStatusColors = {
    idle: "bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600",
    creating: "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600",
    uploading: "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600",
    done: "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-600",
    error: "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-600",
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Video" : "Add New Video"}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isEditMode
              ? "Update video details. Re-upload to replace the video on Bunny.net."
              : "Upload your video directly to Bunny.net CDN and save its details."}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg dark:bg-red-900/20 dark:text-red-300">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 p-8">

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                placeholder="e.g., Introduction to React Hooks"
                required
              />
            </div>

            {/* Bunny.net Video Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Video File {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className={`rounded-xl border-2 border-dashed p-6 transition-all ${uploadStatusColors[uploadState]}`}>

                {uploadState === "idle" && (
                  <div className="text-center">
                    <FiVideo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isEditMode && bunnyVideoId
                        ? "Upload a new file to replace the current video"
                        : "Select a video file to upload to Bunny.net"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      MP4, MOV, MKV — up to several GB (resumable)
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
                    >
                      <FiUpload className="w-4 h-4" />
                      Select Video
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoFileSelect}
                    />
                  </div>
                )}

                {uploadState === "creating" && (
                  <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                    <FiLoader className="animate-spin w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Creating video entry on Bunny.net…</p>
                      <p className="text-xs opacity-75">This only takes a second</p>
                    </div>
                  </div>
                )}

                {uploadState === "uploading" && (
                  <div>
                    <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300 mb-3">
                      <FiLoader className="animate-spin w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">Uploading: {selectedFile?.name}</p>
                        <p className="text-xs opacity-75">
                          Uploading directly to Bunny.net CDN — {uploadProgress}% complete
                        </p>
                      </div>
                      <span className="text-xl font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={cancelUpload}
                      className="mt-3 text-xs text-red-600 hover:text-red-800 dark:text-red-400 underline"
                    >
                      Cancel upload
                    </button>
                  </div>
                )}

                {uploadState === "done" && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                      <FiCheckCircle className="w-6 h-6 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">
                          {isEditMode && !selectedFile
                            ? "Video already uploaded to Bunny.net"
                            : `${selectedFile?.name || "Video"} — upload complete!`}
                        </p>
                        <p className="text-xs opacity-75 font-mono">Bunny ID: {bunnyVideoId}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setUploadState("idle"); setSelectedFile(null); }}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline flex-shrink-0"
                    >
                      Replace
                    </button>
                  </div>
                )}

                {uploadState === "error" && (
                  <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                    <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Upload failed. Please try again.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setUploadState("idle"); setSelectedFile(null); }}
                      className="text-xs underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order & Free Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="order" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Video Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min={0}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm transition"
                />
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    id="isFree"
                    name="isFree"
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Free Preview</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Non-subscribers can watch</span>
                  </div>
                </label>
              </div>

              {isAdmin && (
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      id="isPublished"
                      name="isPublished"
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Published</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">Make this video visible to students</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 sm:text-sm transition"
                placeholder="Add a description for this video (optional)"
              />
            </div>

            {/* Attachments - Edit Mode Only */}
            {isEditMode && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attachments</h3>
                <div className="mb-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                    <FiUpload className="h-4 w-4" />
                    {uploadingFile ? "Uploading…" : "Add Attachment"}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploadingFile} />
                  </label>
                </div>
                <div className="space-y-2">
                  {attachedFiles.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No files attached yet.</p>
                  ) : (
                    attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center overflow-hidden">
                          <FiFile className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {file.title || file.name || `File ${index + 1}`}
                          </span>
                        </div>
                        <div className="flex-shrink-0 ml-4 flex items-center gap-4">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                          >
                            Download
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file._id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete file"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-semibold rounded-lg text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50"
              >
                <FiX className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadState === "uploading" || uploadState === "creating"}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <><FiLoader className="animate-spin h-4 w-4" /> Saving…</>
                ) : (
                  <><FiSave className="h-4 w-4" /> {isEditMode ? "Update Video" : "Save Video"}</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoForm;
