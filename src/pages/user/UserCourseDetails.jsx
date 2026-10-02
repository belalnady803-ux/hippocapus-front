import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../store/authStore";
import { FiChevronDown, FiChevronRight, FiPlay } from "react-icons/fi";

const fetchCourseDetails = async (courseId) => {
  try {
    const res = await axios.get(`${API_URL}/user/courses/${courseId}`);
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
};

const UserCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({});

  const {
    data: course,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseDetails(id),
  });

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleVideoClick = (moduleId, videoId) => {
    navigate(`/my-courses/${id}/${moduleId}/videos/${videoId}?preview=false`);
  };

  if (loading)
    return (
      <div className="pt-24 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="pt-24 text-center text-red-600">
        Failed to load course.
      </div>
    );
  if (!course) return null;

  return (
    <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
        {course.title || "Course Subjects"}
      </h2>
      {course.description && (
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {course.description}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {course &&
        course.enrolledModules &&
        course.enrolledModules.length > 0 ? (
          course.enrolledModules.map((mod) => {
            const moduleId = mod.moduleId || mod._id;
            const isExpanded = expandedModules[moduleId];
            const videos = mod.videos || [];

            return (
              <div
                key={moduleId}
                className="bg-white dark:bg-[#21262B] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden transition-all"
              >
                {/* Module header — click to expand/collapse */}
                <button
                  type="button"
                  onClick={() => toggleModule(moduleId)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-black dark:text-white">
                      {mod.title}
                    </span>
                    {mod.description && (
                      <p className="text-sm mt-0.5 text-gray-500 dark:text-gray-400 truncate">
                        {mod.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {videos.length} {videos.length === 1 ? "video" : "videos"}
                    </span>
                    {isExpanded ? (
                      <FiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform" />
                    ) : (
                      <FiChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform" />
                    )}
                  </div>
                </button>

                {/* Collapsible video list */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    {videos.length > 0 ? (
                      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {videos.map((video) => (
                          <li
                            key={video._id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                            onClick={() =>
                              handleVideoClick(moduleId, video._id)
                            }
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <FiPlay className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                {video.title}
                              </span>
                              {video.isFree && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-semibold flex-shrink-0">
                                  FREE
                                </span>
                              )}
                            </div>
                            <button
                              className="flex-shrink-0 ml-3 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVideoClick(moduleId, video._id);
                              }}
                            >
                              <FiPlay className="w-3 h-3" />
                              Watch
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500 italic">
                        No videos available yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 dark:text-gray-400 bg-white dark:bg-[#21262B] rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            No modules available.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCourseDetails;
