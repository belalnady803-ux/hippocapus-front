import { FiPlus } from "react-icons/fi";
import VideoRow from "./VideoRow";
import { useNavigate } from "react-router";
import { useState } from "react";

const VideosSection = ({ moduleData, courseId, moduleId }) => {
const [module, setModule] = useState (moduleData);
  const navigate = useNavigate();
  const handleAddVideo = () => {
    navigate(`/admin/courses/${courseId}/modules/${moduleId}/videos/new`);
  };

  const handleDeleteVideo = (videoId) => {
    // Implement logic to update the moduleData.videos array
    // after a video has been successfully deleted.
    // For example:
    setModule((prevModuleData) => ({
      ...prevModuleData,
      videos: prevModuleData.videos.filter((video) => video._id !== videoId),
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Videos
        </h3>
        <button
          onClick={handleAddVideo}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiPlus className="mr-1.5 h-4 w-4" /> Add Video
        </button>
      </div>

      {module.videos?.length ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {moduleData.videos.map((video) => (
            <VideoRow
              key={video._id}
              video={video}
              courseId={courseId}
              moduleId={moduleId}
              onDelete={handleDeleteVideo} // Pass the delete handler
            />
          ))}
        </div>
      ) : (
        <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
          No videos added yet
        </div>
      )}
    </div>
  );
};

export default VideosSection;
