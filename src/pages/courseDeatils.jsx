import { useParams, Navigate } from "react-router";

export default function CourseDetail() {
  const { id } = useParams(); 
  
  // Redirect to the new course details structure
  return <Navigate to={`/courses/${id}`} replace />;
}
