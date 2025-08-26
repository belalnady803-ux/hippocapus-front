import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { API_URL } from "../store/authStore.js";
export default function CourseOverview() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`${API_URL}/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  if (loading) return <p className="text-center mt-20 dark:text-p4">Loading course...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!course) return <p className="text-center mt-20 dark:text-p4">Course not found.</p>;

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="mb-8">
        {/* <h1 className="text-4xl font-extrabold text-gray-900 dark:text-p4 mb-4">{course.title}</h1> */}
        {/* i might replace it with actual over view */}
        {/* <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{course.description}</p> */}
      </div>

      {/* Course Highlights */}
      {/* <div className="bg-p4 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-p4 mb-4">What You'll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Comprehensive understanding of medical concepts</span>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Practical applications and case studies</span>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Interactive quizzes and assessments</span>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Expert-led instruction from medical professionals</span>
          </div>
        </div>
      </div> */}

      {/* Course Requirements */}
      {/* <div className="bg-p4 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-p4 mb-4">Requirements</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Basic understanding of biology and chemistry</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Access to a computer with internet connection</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Dedication to learning and completing assignments</span>
          </li>
        </ul>
      </div> */}

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-p4 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-2">
            {course.modules?.reduce((acc, mod) => acc + (mod.videos?.length || 0), 0)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Lectures</div>
        </div>
        <div className="bg-p4 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-2">
            {course.modules?.reduce((acc, mod) => 
              acc + (mod.videos?.filter(vid => vid.quiz)?.length || 0), 0)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Quizzes</div>
        </div>
        <div className="bg-p4 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-2">
            {course.modules?.length || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400">subjects</div>
        </div>
      </div>

      {/* Instructors */}
      {course.instructors?.length > 0 && (
        <div className="bg-p4 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-p4 mb-6">Meet Your Instructors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.instructors.map((inst) => (
              <div key={inst._id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {inst.image && (
                  <img 
                    src={inst.image} 
                    alt={inst.name} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400 flex-shrink-0" 
                  />
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-p4">{inst.name}</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-500 mb-2">{inst.specialized}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{inst.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
