import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../store/authStore";

/*
  plan for this page : 
    1- you will git the id of the course from the url using seach params
    2 - by this id i will fetch the course details from the backend using useEffect and axios
    3 - the course details => i wnat the modules of the course and on click of the moulde it will direct the ueer to a page whrer all the videos of the module are listed the route for this page is /my-courses/:id/:moduleId
    
*/ 



const UserCourseDetails = () => {
  const {id} = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Course ID not found in URL.");
      setLoading(false);
      return;
    }
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_URL}/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        setError("Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleModuleClick = (moduleId) => {
    navigate(`/my-courses/${id}/${moduleId}`);
  };

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (error) return <div className="pt-24 text-center text-red-600">{error}</div>;
  if (!course) return null;

  return (
    <div className="pt-24 px-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{course.title}</h2>
      <p className="mb-6 text-p2 dark:text-p4">{course.description}</p>
      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Modules</h3>
      <ul className="flex flex-col gap-3">
        {course.modules && course.modules.length > 0 ? (
          course.modules.map((mod) => (
            <li
              key={mod._id}
              className="bg-gray-100 dark:bg-dark-Bg rounded-lg p-4 cursor-pointer hover:bg-primary hover:text-white transition"
              onClick={() => handleModuleClick(mod._id)}
            >
              <span className="font-medium">{mod.title}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No modules available.</li>
        )}
      </ul>
    </div>
  );
};

export default UserCourseDetails;
