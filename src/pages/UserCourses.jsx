import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../store/authStore.js';

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
  return data.enrolledCourses || [];
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
      <section className="container pt-28 text-center min-h-screen">
        <h1 className="text-4xl font-black dark:text-p4 mb-4">My Courses</h1>
        <p className="text-lg text-p3 dark:text-[#94ABC7]">
          You haven't enrolled in any courses yet.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-block bg-p1 text-p2 rounded-full py-3 px-6 font-semibold hover:opacity-90 transition-opacity"
        >
          Browse Courses
        </Link>
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
          <Link to={`/my-courses/${course.id}`} key={course.id}>
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
                  <button className="w-full bg-p1 text-p2 rounded-full py-2 px-4 cursor-pointer font-semibold hover:opacity-80 transition-opacity">
                    Continue Learning
                  </button>
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
