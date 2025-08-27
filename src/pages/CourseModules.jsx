import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";
import Spinner from "../components/spinner"
import { API_URL } from "../store/authStore.js";
export default function CourseModules() {
  const { id } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`${API_URL}/courses/${id}/modules`);
        setModules(res.data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  if (loading) return   <main className="flex py-6 justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </main>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!modules) return <p className="text-center mt-20 dark:text-p4">No subjects found for this course.</p>;
  const totalLectures = modules?.reduce((acc, mod) => acc + (mod.videos?.length || 0), 0) || 0;
  const totalQuizzes = modules?.reduce((acc, mod) => 
    acc + (mod.videos?.filter(vid => vid.quiz)?.length || 0), 0) || 0;

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            {totalQuizzes} quizzes
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
              <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-p4">
                      {mod.title}
                    </h3>
                    {/* <p className="text-gray-600 dark:text-gray-400 mt-1">{mod.description}</p> */}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {mod.videos?.length || 0} lectures • {mod.videos?.filter(vid => vid.quiz)?.length || 0} quizzes
                  </div>
                </div>
              </div>
              
              {/* Videos */}
              {mod.videos?.length > 0 && (
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
                              {vid.duration && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                  {vid.duration}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {vid.isFree ? (
                            <Link 
                              to={`/courses/${id}/modules/${mod._id}/videos/${vid._id}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:underline flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Preview
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
