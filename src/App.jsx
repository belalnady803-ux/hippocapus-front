import { Route, createBrowserRouter ,createRoutesFromElements ,RouterProvider, Navigate , Outlet} from "react-router"
import Layout from "./pages/Layout"
import Home from "./pages/Home.jsx"
import Courses from "./pages/Courses.jsx"
import FAQ from "./pages/FAQ.jsx"
import Contact from "./pages/Contact.jsx"
import LogIn , {loader} from "./pages/LogIn.jsx"
import SignUp , {action as signUpaction} from "./pages/SingUp.jsx"
import VerifyEmail from "./pages/verify-email.jsx"
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import MyCourses from "./pages/UserCourses.jsx";
import CourseDetailsLayout from "./pages/CourseDetailsLayout.jsx"
import CourseOverview from "./pages/CourseOverview.jsx"
import CourseModules from "./pages/CourseModules.jsx"
import CourseReviews from "./pages/CourseReviews.jsx"
import VideoPlayerPage from "./pages/VideoPlayerPage.jsx";
import Admin from "./pages/Admin.jsx";
import AddCourse from "./pages/AddCourse.jsx";
import EditCourse from "./pages/EditCourse.jsx";
import ModulePage from "./pages/ModulePage/ModulePage.jsx";
import VideoForm from "./pages/VideoForm.jsx";
import QuizForm from "./pages/QuizForm.jsx";
import AddInstructor from "./pages/AddInstructor.jsx";
import UserCourseDetails from "./pages/UserCourseDetails.jsx";
import UserModuleDetails from "./pages/UserModuleDetails.jsx";


const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) {
		return <div>Loading...</div>; // Or a loading spinner component
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}
	if (!user || !user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};
const IsAdminRoute = ({ children }) => {
	const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) {
		return <div>Loading...</div>; // Or a loading spinner component
	}

  if (!isAuthenticated || !user || !user.rules.includes("ADMIN")) {
		return <Navigate to='/' replace />;
	}
	return children;
};
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="admin" element={<IsAdminRoute><Outlet /></IsAdminRoute>}>
          <Route index element={<Admin />} />
          <Route path="courses/new" element={<AddCourse />} />
          <Route path="courses/:id/edit" element={<EditCourse />} />
          <Route path="courses/:courseId/instructors/add" element={<AddInstructor />} />
          <Route path="courses/:courseId/modules/:moduleId" element={<ModulePage />} />
          <Route path="courses/:courseId/modules/:moduleId/videos/new" element={<VideoForm />} />
          <Route path="courses/:courseId/modules/:moduleId/videos/:videoId/edit" element={<VideoForm />} />
          <Route path="courses/:courseId/modules/:moduleId/videos/:videoId/quiz" element={<QuizForm />} />
          <Route path="courses/:courseId/modules/:moduleId/videos/:videoId/quiz/:quizId" element={<QuizForm />} />
        </Route>
        <Route path="courses" element={<Courses/>} />
        <Route path="courses/:id" element={<CourseDetailsLayout/>}>
          <Route index element={<CourseOverview/>} />
          <Route path="modules" element={<CourseModules/>} />
          <Route path="reviews" element={<CourseReviews/>} />
        </Route>
        <Route path="courses/:id/modules/:moduleId/videos/:videoId" element={<VideoPlayerPage />} />
        <Route path ="faq" element={<FAQ/>} />
        <Route path = "contact" element={<Contact /> }/>
        <Route path="my-courses" element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        }> 
        </Route>
        <Route path="my-courses/:id" element={<UserCourseDetails />} />
        <Route path="my-courses/:id/:moduleId" element={<UserModuleDetails />} />
        <Route path="my-courses/:id/:moduleId/videos/:videoId" element={<VideoPlayerPage />} />
      <Route path="login" element={
        <RedirectAuthenticatedUser>
          <LogIn/>
        </RedirectAuthenticatedUser>
      } loader={loader}/> 
      <Route path="signup" element={
        <RedirectAuthenticatedUser>
          <SignUp/>
        </RedirectAuthenticatedUser>
      } action={signUpaction}/> 

      <Route path="verify-email" element={
        <RedirectAuthenticatedUser>
          <VerifyEmail/>
        </RedirectAuthenticatedUser>
      }/> 
      </Route>
))


export default function App() {
  const { checkAuth } = useAuthStore();
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);
  return (
      <RouterProvider router={router} />
  );
}
