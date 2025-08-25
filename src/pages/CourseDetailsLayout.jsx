import { Link, useParams, Outlet, useLocation , useNavigate} from "react-router";
import { useQuery } from "@tanstack/react-query";
import useWhatsApp from '../Hooks/useWhatsApp';
import { useAuthStore , API_URL} from "../store/authStore.js";
import axios from "axios";

const CourseDetailsLayout = () => { // Changed to a React component
  const number = "966566292547";
  const navigate = useNavigate();
  const {openWhatsApp} = useWhatsApp(number);
  const {isAuthenticated} = useAuthStore();
  const goToWhatsApp = (courseTitle) => {
    const message = `Hello, I want to enroll in the ${courseTitle} course. Could you please provide more details?`;
    openWhatsApp(message);
  }
  const handleEnrollClick = (title) => {
    if (isAuthenticated) {
      // If the user is logged in, proceed to WhatsApp.
      goToWhatsApp(title);
    } else {
      // If the user is not logged in, redirect to the login page with a message.
      navigate('/login?message=You must log in to enroll in a course.');
    }
  }

  const { id } = useParams();
  const location = useLocation();

    async function fetchCourse() {
      try {
        const res = await axios.get(`${API_URL}/courses/${id}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course details. Please try again later.");
      }
    }
    const {
    data: course,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: fetchCourse,
    staleTime: 1000 * 60 * 5, // 5 minutes cache before refetch
    cacheTime: 1000 * 60 * 10, // keep in memory for 10 minutes
    refetchOnWindowFocus: false, // don’t refetch when tab is focused
  });


  const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (loading) return <p className="text-center mt-20 dark:text-p4">Loading course...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!course) return <p className="text-center mt-20 dark:text-p4">Course not found.</p>;

  const calculateAverageRating = () => {
    if (!course.reviews || course.reviews.length === 0) return 0;
    const total = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / course.reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();
  const totalReviews = course.reviews?.length || 0;

  // Determine active tab based on current location
  const getActiveTab = () => {
    if (location.pathname.includes('/modules')) return 'modules';
    if (location.pathname.includes('/reviews')) return 'reviews';
    return 'overview';
  };

  const activeTab = getActiveTab();

  return (
    <main className="bg-gray-50 dark:bg-[#1e1e1e] pt-36">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Course Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-p4 mb-2">{course.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
              
              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(averageRating)} />
                  <span>{averageRating} ({totalReviews} reviews)</span>
                </div>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  {course.modules?.reduce((acc, mod) => acc + (mod.videos?.length || 0), 0)} lectures
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.modules?.length || 0} modules
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
              <nav className="flex space-x-8">
                <Link
                  to={`/courses/${id}`}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to={`/courses/${id}/modules`}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'modules'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Modules
                </Link>
                <Link
                  to={`/courses/${id}/reviews`}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Reviews ({totalReviews})
                </Link>
              </nav>
            </div>

            {/* Content Area */}
            <Outlet />
          </div>

          {/* Right Column: Course Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-p4 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-3xl font-bold text-gray-900 dark:text-p4 mb-4">
                    ${course.price}
                  </p>
                  <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4"
                  onClick={() => handleEnrollClick(course.title)}>
                    Enroll Now
                  </button>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.modules?.reduce((acc, mod) => acc + (mod.videos?.length || 0), 0)} lectures</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{course.modules?.reduce((acc, mod) => 
                        acc + (mod.videos?.filter(vid => vid.quiz)?.length || 0), 0)} quizzes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Access on mobile and TV</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CourseDetailsLayout;
