import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { FiVideo, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { API_URL } from "../../store/authStore";

const InstructorCourseModules = () => {
  const { slug } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${API_URL}/instructor/courses/${slug}/modules`);
        setModules(response.data.data);
      } catch (err) {
        console.error('Error fetching instructor modules:', err);
        setError('Failed to load your modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assigned Modules</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage videos in your assigned modules.</p>
          </div>
          <Link
            to="/instructor/dashboard"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>

      {modules.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">No modules found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((module) => (
            <div key={module._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{module.title}</h3>
                <Link
                  to={`/instructor/courses/${slug}/modules/${module._id}/videos/new`}
                  className="inline-flex items-center text-sm bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
                >
                  <FiPlus className="mr-1" /> Add Video
                </Link>
              </div>

              {module.videos && module.videos.length > 0 ? (
                <ul className="space-y-3">
                  {module.videos.map((video) => (
                    <li key={video._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <FiVideo className="text-gray-400 mr-3 h-5 w-5" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{video.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${video.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {video.isPublished ? 'Published' : 'Pending Approval'}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/instructor/courses/${slug}/modules/${module._id}/videos/${video._id}/edit`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No videos in this module yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourseModules;
