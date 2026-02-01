import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../store/authStore";
const fetchCourseDetails = async (courseId) => {
  try{
    const res = await axios.get(`${API_URL}/user/courses/${courseId}/modules`);
    return res.data.data.modules;
  }catch(err){
    console.log(err);
  }
}
const UserCourseDetails = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const { 
    data: course, // Renaming 'data' to 'courses' for clarity
    isLoading:loading, 
    isError : error,
  } = useQuery({
    queryKey: ['course', id], // Add id to key for uniqueness
    queryFn: () => fetchCourseDetails(id), // Pass a function, not the result
  });
  const handleModuleClick = (moduleId) => {
    navigate(`/my-courses/${id}/${moduleId}`);
  };
  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (error) return <div className="pt-24 text-center text-red-600">{error}</div>;
  if (!course) return null;
  return (
    <div className="pt-24 px-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Course Subjects</h2>
      {/* Optionally show course description if available */}
      {course.description && (
        <p className="mb-6  dark:text-p4 text-gray-700">{course.description}</p>
      )}
      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Subjects</h3>
      <ul className="flex flex-col gap-4">
        {course && course.length > 0 ? (
          course.filter(mod => mod.isPublished).map((mod) => (
            <li
              key={mod._id}
              className="bg-white dark:bg-[#21262B] border border-gray-200 dark:border-dark-Cs rounded-xl p-4 cursor-pointer shadow hover:bg-primary hover:text-white transition-colors"
              onClick={() => handleModuleClick(mod._id)}
            >
              <span className="font-medium text-black dark:text-white">{mod.title}</span>
              {mod.description && (
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{mod.description}</p>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-400 bg-white dark:bg-[#21262B] rounded-xl p-4 text-center">
            No modules available.
          </li>
        )}
      </ul>
    </div>
  );
};

export default UserCourseDetails;
