import {useEffect, useState } from "react";
import { useParams, Link, useNavigate  } from "react-router";
import axios from "axios";
import { API_URL, useAuthStore } from "../store/authStore.js";
import Spinner from "../components/spinner"
import WistiaPlayerFunction from '../components/WistiaPlayer.jsx'; // <-- update path as needed

// Quiz Modal Component
const QuizModal = ({ quiz, isOpen, onClose, onStartQuiz }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-p4 mb-4">{quiz.title}</h2>
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{quiz.timeLimit} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{quiz.questions?.length || 0} questions</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Passing score: {quiz.passingScore}%</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onStartQuiz}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-p4 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VideoPlayerPage() {
  const { id,moduleId, videoId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [video, setVideo] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);


  const endPoint = `${API_URL}/user/courses/${id}/modules/${moduleId}/video/${videoId}`;

  useEffect(() => {
    async function fetchVideoDetails() {
      try {
        setLoading(true);
        const res = await axios.get(endPoint);
        const video = res.data;
        setVideo(video);
        if (video.quiz) {
            try {
              const quizRes = await axios.get(`${API_URL}/quizzes/${foundVideo.quiz}`);
              setQuiz(quizRes.data);
            } catch (quizErr) {
              console.error("Failed to fetch quiz:", quizErr);
              // Don't set error, just log it - quiz is optional
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
  }, [videoId]);

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
              onClick={() => navigate(`/courses/${courseId}`)}
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
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
            <Link to={`/courses/${id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                &larr; Back to {courseTitle}
            </Link>
        </div>
        <div className="bg-p4 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video bg-black">
            {/* Replace video display with wisitaPlayerFunction */}
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
            {video.isFree && (
              <p className="text-gray-600 dark:text-gray-400">
                This is a preview video. Enroll in the course to access all content.
              </p>
            )}
            
            {/* Quiz Button */}
            {quiz && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Start Quiz for This Lecture
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quiz Modal */}
      <QuizModal
        quiz={quiz}
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onStartQuiz={() => {
          setShowQuizModal(false);
          // TODO: Navigate to quiz page or start quiz
          console.log("Starting quiz:", quiz);
          // For now, just show an alert
          alert("Quiz functionality will be implemented next!");
        }}
      />
    </main>
  );
}