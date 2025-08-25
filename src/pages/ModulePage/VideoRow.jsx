import React from "react";
import { FiEdit2, FiFileText, FiTrash2, FiVideo } from "react-icons/fi";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../store/authStore";

const VideoRow = ({ video, courseId, moduleId, onDelete }) => {
  const navigate = useNavigate();

  const handleEditVideo = () => {
    navigate(`/admin/courses/${courseId}/modules/${moduleId}/videos/${video._id}/edit`);
  };

  const handleAddQuiz = () => {
    navigate(`/admin/courses/${courseId}/modules/${moduleId}/videos/${video._id}/quiz`);
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await axios.delete(
        `${API_URL}/admin/courses/${courseId}/modules/${moduleId}/video/${videoId}`,
      );
      if (response.data?.success) {
        toast.success("Video deleted successfully");
        onDelete(videoId); // Call the onDelete function to update the UI
      } else {
        throw new Error(response.data?.message || "Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete video";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
          <FiVideo className="h-5 w-5 text-gray-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {video.title}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {video.description?.substring(0, 50)}
            {video.description?.length > 50 ? "..." : ""}
          </div>
        </div>
      </div>

      <div className="flex space-x-2 text-sm">
        <button
          onClick={handleEditVideo}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <FiEdit2 className="h-4 w-4" />
        </button>
        <button
          onClick={handleAddQuiz}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
        >
          <FiFileText className="h-4 w-4" />
        </button>
        <button
          onClick={() => deleteVideo(video._id)}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default VideoRow;

