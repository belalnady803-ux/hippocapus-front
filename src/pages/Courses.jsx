import { useQuery } from '@tanstack/react-query';
import { Link} from 'react-router';
import Button from '../components/Button.jsx';
import {API_URL} from '../store/authStore.js';

const fetchCourses = async () => { 
    const response = await fetch(`${API_URL}/courses`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch courses");
    }
    const  data = await response.json();
    return data;
};




const Courses = () => {
  const { 
    data: courses, // Renaming 'data' to 'courses' for clarity
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['courses'], // A unique key for this query
    queryFn: fetchCourses   // The function that fetches the data
  });

  if (isLoading) {
    return (
      <div className="container pt-28 text-center min-h-screen">
        <p className="text-lg text-p3 dark:text-[#94ABC7]">Loading courses...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="container pt-28 text-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error.message}</p>
      </div>
    );
  }


  return (
    <section className="container pt-28">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black dark:text-p4 mb-4">Our Courses</h1>
        <p className="text-lg text-p3 dark:text-[#94ABC7]">
          Explore our range of specialized medical courses.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses?.map((course) => (
            <Link to={`/courses/${course._id}`} className="no-underline" key={course._id}>
            <div key={course._id} className="bg-p4 dark:bg-[#21262B] rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 dark:border-dark-Cs flex flex-col">
              <img src={course.image ?? ""} alt={course.title} loading="lazy" className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-2">
                </div>
                <h3 className="text-xl font-bold text-p2 dark:text-p4 mb-2">{course.title}</h3>
                <p className="text-p3 dark:text-[#94ABC7] text-sm mb-4 flex-grow">{course.description}</p>
                <div className="text-sm text-p3 dark:text-[#94ABC7] mb-4">
                  <p><span className="font-bold">Instructor:</span> {course.instructor}</p>
                </div>
                <div className="mt-auto flex justify-between items-center">
                  <p className="text-lg font-bold text-p2 dark:text-p4">{course.price} SAR</p>
                  <Button onClick={() => handleEnrollClick(course.title)} text="more details" 
                  ></Button>
                </div>
              </div>
            </div>
        </Link>
        ))}
      </div>
    </section>
  )
}

export default Courses
