import { useState } from "react";
import { Link, useParams, useOutletContext } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "../../components/spinner"
import { API_URL } from "../../store/authStore.js";
export default function CourseModules() {
  const { slug } = useParams();
  const { isEnrolled } = useOutletContext() || { isEnrolled: false };
  const { data: modules, isLoading: loading, isError, error } = useQuery({
    queryKey: ['course-modules', slug],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/courses/${slug}/modules`);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (loading) return   <main className="flex py-6 justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </main>;
  if (isError) return <p className="text-center mt-20 text-red-500">{error?.message || "Error loading modules"}</p>;
  if (!modules) return <p className="text-center mt-20 dark:text-p4">No subjects found for this course.</p>;
  const totalLectures = modules?.reduce((acc, mod) => acc + (mod.videos?.length || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="mb-6">
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            {totalLectures} lectures
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {modules?.length || 0} subjects
          </span>
        </div>
      </div>

      {/* Modules */}
      {modules?.length > 0 ? (
        <div className="space-y-6">
          {modules.map((mod) => (
            <div key={mod._id} className="bg-p4 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
              {/* Module Header */}
              <button 
                className="w-full text-left p-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 transition-colors flex items-center justify-between cursor-pointer"
                onClick={() => toggleModule(mod._id)}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-p4">
                    {mod.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {mod.videos?.length || 0} {mod.videos?.length === 1 ? 'video' : 'videos'}
                  </span>
                  <svg 
                    className={`w-6 h-6 text-gray-500 transition-transform ${expandedModules[mod._id] ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Videos */}
              {expandedModules[mod._id] && mod.videos?.length > 0 && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mod.videos.map((vid, vidIndex) => (
                    <div key={vid._id}>
                      <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
                            {vidIndex + 1}
                          </div>
                          <div className="flex items-center gap-3 flex-1">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <span className="font-medium text-gray-800 dark:text-gray-200">{vid.title}</span>
                              {vid.durationInSeconds > 0 && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                  {Math.floor(vid.durationInSeconds / 60)}:{String(vid.durationInSeconds % 60).padStart(2, '0')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isEnrolled || vid.isFree ? (
                            <Link 
                              to={`/courses/${slug}/modules/${mod._id}/videos/${vid._id}?preview=${!isEnrolled}`} 
                              className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:underline flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {isEnrolled ? "Watch" : "Preview"}
                            </Link>
                          ) : (
                            <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              Locked
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Video Quiz Indicator */}
                      {vid.quiz && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <span className="text-sm font-medium">Quiz available for this lecture</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-p4 mb-2">No subjects available</h3>
          <p className="text-gray-500 dark:text-gray-400">Course content will be available soon.</p>
        </div>
      )}
    </div>
  );
}
