import { Link} from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../store/authStore.js';
import Button from '../components/Button.jsx';

// Function to fetch courses from your backend API
const fetchSubscribedCourses = async () => {
  const response = await fetch(`${API_URL}/user/courses`, {
    method: "GET",
    credentials: "include", // important if using cookies/sessions
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data = await response.json();
  return data.data.uniqueCourses || [];
};

function MyCourses() {
  const { data: courses, error, isLoading } = useQuery({
    queryKey: ['myCourses'],
    queryFn: fetchSubscribedCourses,
  });
  if (isLoading) {
    return (
      <div className="container pt-28 text-center min-h-screen">
        <p className="text-lg text-p3 dark:text-[#94ABC7]">Loading your courses...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container pt-28 text-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error.message || 'An unknown error occurred'}</p>
      </div>
    );
  }
  if (!courses || courses.length === 0) {
    return (
      <section className="container pt-28 text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black dark:text-p4 mb-4">My Courses</h1>
        <p className="text-lg text-p3 dark:text-[#94ABC7]">
          You haven't enrolled in any courses yet.
        </p>
        <Button text="Browse Courses" className="w-54 h-12 mt-6 text-6xl" onClick={() => window.location.href = "/courses"}>
        </Button>

      </section>
    );
  }

  return (
    <section className="container pt-28 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black dark:text-p4 mb-4">My Enrolled Courses</h1>
        <p className="text-lg text-p3 dark:text-[#94ABC7]">
          Continue your learning journey with the courses you've enrolled in.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link to={`/my-courses/${course._id}`} key={course._id}>
            <div className="bg-p4 dark:bg-[#21262B] rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 dark:border-dark-Cs flex flex-col h-full">
              <img
                src={course.image || ""}
                alt={course.title}
                loading="lazy"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-p2 dark:text-p4 mb-2">
                  {course.title}
                </h3>
                <p className="text-p3 dark:text-[#94ABC7] text-sm mb-4 flex-grow">
                  {course.description}
                </p>
                <div className="mt-auto">
                  <Button text="Continue Learning">
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default MyCourses;
