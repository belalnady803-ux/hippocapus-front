import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { API_URL, useAuthStore } from "../store/authStore.js";
import Spinner from "../components/spinner"
import WistiaPlayerFunction from '../components/WistiaPlayer.jsx';
import QuizPlayer from "../components/QuizPlayer.jsx";
import { FiFile, FiDownload, FiPlayCircle } from "react-icons/fi";

// Simple Quiz Intro Modal
const QuizIntroModal = ({ quiz, isOpen, onClose, onStartQuiz }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-4">
            <FiPlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h2>
          <p className="text-gray-500 dark:text-gray-400">Ready to test your knowledge?</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">Time Limit:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{quiz.timeLimit} mins</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">Questions:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{quiz.questions?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">Passing Score:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{quiz.passingScore}%</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onStartQuiz}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            Start Quiz
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VideoPlayerPage() {
  const { id, moduleId, videoId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showQuizIntro, setShowQuizIntro] = useState(false);
  const [isPlayingQuiz, setIsPlayingQuiz] = useState(false);
  const isPreview = useSearchParams()[0].get("preview") === "true";


  const endPoint = isPreview ? `${API_URL}/courses/${id}/modules/${moduleId}/video/${videoId}/free` : `${API_URL}/user/courses/${id}/modules/${moduleId}/video/${videoId}`;

  useEffect(() => {
    if (isCheckingAuth) return;

    async function fetchVideoDetails() {
      try {
        setLoading(true);
        const res = await axios.get(endPoint);
        console.log("Video API Response:", res.data); // Debugging
        // Handle potential variations in API response structure
        const videoData = res.data.data || res.data.video || res.data.result;

        if (videoData) {
          setVideo(videoData);
          if (videoData.quiz) {
            try {
              const quizRes = await axios.get(`${API_URL}/quizzes/${videoData.quiz}`);
              setQuiz(quizRes.data.data);
            } catch (quizErr) {
              console.error("Failed to fetch quiz:", quizErr);
            }
          }
        } else {
          console.warn("Video data missing in response", res.data);
          // Optionally check if res.data itself is the video if it has an _id (fallback)
          if (res.data && res.data._id) {
            setVideo(res.data);
            // Also check quiz for fallback
            if (res.data.quiz) {
              try {
                const quizRes = await axios.get(`${API_URL}/quizzes/${res.data.quiz}`);
                setQuiz(quizRes.data.data);
              } catch (quizErr) {
                console.error("Failed to fetch quiz:", quizErr);
              }
            }
          }
        }
      }
      catch (err) {
        console.error("Failed to fetch video details:", err);
        setError("Failed to load video. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideoDetails();
  }, [videoId, endPoint, isAuthenticated, isCheckingAuth]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center px-4">
        <p className="text-2xl text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Course
        </button>
      </main>
    );
  }

 

  if (!video) {
    return <p className="text-center mt-20 dark:text-p4">Video not found.</p>;
  }

  // Quiz Player Overlay
  if (isPlayingQuiz && quiz) {
    return (
      <QuizPlayer
        quiz={quiz}
        onClose={() => setIsPlayingQuiz(false)}
      />
    );
  }

  // Check if user can access this video
  if (!video.isFree && !isAuthenticated) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center px-4 ">
        <div className="bg-p4 dark:bg-gray-800 rounded-lg p-8 max-w-md">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-p4 mb-4">Video Locked</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This video requires enrollment. Please log in and enroll in the course to access this content.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate(`/courses/${id}`)}
              className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-p4 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-900 pt-24 min-h-screen flex flex-col items-center justify-center ">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-6">
          <Link to={`/courses/${id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Course
          </Link>
        </div>
        <div className="bg-p4 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video bg-black">
            <WistiaPlayerFunction wistiaId={video.url} />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-p4">{video.title}</h1>
              {video.isFree && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
                  Preview
                </span>
              )}
            </div>

            {/* Description */}
            {video.description && (
              <div className="mt-4 mb-6 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {video.description}
              </div>
            )}

            {video.isFree && !video.description && (
              <p className="text-gray-600 dark:text-gray-400">
                This is a preview video. Enroll in the course to access all content.
              </p>
            )}

            {/* Attachments Section */}
            {video.files && video.files.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Resources & Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {video.files.map((file, index) => (
                    <a
                      key={index}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow group"
                    >
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        <FiFile className="w-6 h-6" />
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.title || file.name || `File ${index + 1}`}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-blue-600 dark:text-blue-400">
                          <FiDownload className="mr-1" />
                          <span>Download</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Button */}
            {quiz && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowQuizIntro(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
                >
                  <div className="p-1 bg-white/20 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-lg">Take the Quiz</span>
                    <span className="block text-xs font-normal opacity-90 text-left">Test your understanding of this lecture</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Intro Modal */}
      <QuizIntroModal
        quiz={quiz}
        isOpen={showQuizIntro}
        onClose={() => setShowQuizIntro(false)}
        onStartQuiz={() => {
          setShowQuizIntro(false);
          setIsPlayingQuiz(true);
        }}
      />
    </main>
  );
}