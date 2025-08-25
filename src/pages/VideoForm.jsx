import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import axios from "axios";
import { FiSave, FiX, FiUpload } from "react-icons/fi";
import { API_URL } from "../store/authStore";

const VideoForm = () => {
  const { courseId, moduleId, videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!videoId;

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    duration: "00:00",
    isFree: false,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // If in edit mode, fetch the video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/admin/courses/${courseId}/modules/${moduleId}/video/${videoId}`
        );
        setFormData({
          title: data.title,
          url: data.url,
          duration: data.duration || "00:00",
          isFree: data.isFree || false,
          description: data.description || "",
        });
        if (data.url) setPreviewUrl(data.url);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video data");
      }
    };

    if (isEditMode) {
      fetchVideo();
    }
  }, [courseId, moduleId, videoId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditMode
        ? `${API_URL}/admin/courses/${courseId}/modules/${moduleId}/video/${videoId}`
        : `${API_URL}/admin/courses/${courseId}/modules/${moduleId}/video`;

      const method = isEditMode ? "put" : "post";

      await axios[method](url, formData);
      navigate(`/admin/courses/${courseId}/modules/${moduleId}`);
    } catch (err) {
      console.error("Error saving video:", err);
      setError(
        err.response?.data?.message || "Failed to save video. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Video" : "Add New Video"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditMode
              ? "Update the video details below"
              : "Fill in the details to add a new video to this module"}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Video URL <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="https://example.com/video"
                  required
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  <FiUpload className="mr-2 h-4 w-4" />
                  Upload
                </button>
              </div>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview
                </label>
                <div className="aspect-w-16 aspect-h-9 bg-black rounded-md overflow-hidden">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Duration (MM:SS)
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  pattern="^([0-9]|[0-5][0-9]):[0-5][0-9]$"
                  placeholder="00:00"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Format: MM:SS (e.g., 12:34)
                </p>
              </div>

              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="isFree"
                    name="isFree"
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="isFree"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Free Preview
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Allow non-subscribers to watch this video
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="Add a description for this video (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoForm;
