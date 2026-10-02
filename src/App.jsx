import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate, Outlet } from "react-router"
import Layout from "./pages/Layout"
import Home from "./pages/Home.jsx"
import Courses from "./pages/courses/Courses.jsx"
import FAQ from "./pages/FAQ.jsx"
import Contact from "./pages/Contact.jsx"
import LogIn, { loader } from "./pages/auth/LogIn.jsx"
import SignUp, { action as signUpaction } from "./pages/auth/SingUp.jsx"
import VerifyEmail from "./pages/auth/verify-email.jsx"
import ForgotPassword from "./pages/auth/ForgotPassword.jsx"
import ResetPassword from "./pages/auth/ResetPassword.jsx"
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import MyCourses from "./pages/user/UserCourses.jsx";
import CourseDetailsLayout from "./pages/courses/CourseDetailsLayout.jsx"
import CourseOverview from "./pages/courses/CourseOverview.jsx"
import CourseModules from "./pages/courses/CourseModules.jsx"
import CourseReviews from "./pages/courses/CourseReviews.jsx"
import VideoPlayerPage from "./pages/courses/VideoPlayerPage.jsx";
import Admin from "./pages/admin/Admin.jsx";
import AddCourse from "./pages/admin/AddCourse.jsx";
import EditCourse from "./pages/admin/EditCourse.jsx";
import ModulePage from "./pages/admin/ModulePage/ModulePage.jsx";
import VideoForm from "./pages/admin/VideoForm.jsx";
import QuizForm from "./pages/admin/QuizForm.jsx";
import AddInstructor from "./pages/admin/AddInstructor.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";


import { Toaster } from "react-hot-toast";
import CourseStatus from "./pages/admin/coursStatus/CourseStatusPage.jsx"
import InstructorDashboard from "./pages/instructor/InstructorDashboard.jsx";
import InstructorCourseModules from "./pages/instructor/InstructorCourseModules.jsx";
import NotFound from "./pages/NotFound.jsx"


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

  if (!isAuthenticated || !user || !user.roles?.includes("admin")) {
    return <Navigate to='/' replace />;
  }
  return children;
};
const IsInstructorRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user || (!user.roles?.includes("admin") && !user.roles?.includes("instructor"))) {
    return <Navigate to='/' replace />;
  }
  return children;
};
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user && user.isVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="admin" element={<IsAdminRoute><Outlet /></IsAdminRoute>}>
        <Route index element={<Admin />} />
        <Route path="courses/new" element={<AddCourse />} />
        <Route path="courses/:id/details" element={<CourseStatus />} />
        <Route path="courses/:id/edit" element={<EditCourse />} />
        <Route path="courses/:courseId/instructors/add" element={<AddInstructor />} />
        <Route path="courses/:courseId/modules/:moduleId" element={<ModulePage />} />
        <Route path="courses/:courseId/modules/:moduleId/videos/new" element={<VideoForm />} />
        <Route path="courses/:courseId/modules/:moduleId/videos/:videoId/edit" element={<VideoForm />} />
        <Route path="courses/:courseId/modules/:moduleId/videos/:videoId/quiz" element={<QuizForm />} />
        <Route path="courses/:courseId/modules/:moduleId/videos/:videoId/quiz/:quizId" element={<QuizForm />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
      <Route path="instructor" element={<IsInstructorRoute><Outlet /></IsInstructorRoute>}>
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="courses/:slug/modules" element={<InstructorCourseModules />} />
        <Route path="courses/:slug/modules/:moduleId/videos/new" element={<VideoForm />} />
        <Route path="courses/:slug/modules/:moduleId/videos/:videoId/edit" element={<VideoForm />} />
      </Route>
      <Route path="courses" element={<Courses />} />
      <Route path="courses/:slug" element={<CourseDetailsLayout />}>
        <Route index element={<CourseModules />} />
        <Route path="overview" element={<CourseOverview />} />
        <Route path="reviews" element={<CourseReviews />} />
      </Route>
      <Route path="courses/:slug/modules/:moduleId/videos/:videoId" element={<VideoPlayerPage />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="contact" element={<Contact />} />
      <Route path="my-courses" element={
        <ProtectedRoute>
          <MyCourses />
        </ProtectedRoute>
      }>
      </Route>

      <Route path="login" element={
        <RedirectAuthenticatedUser>
          <LogIn />
        </RedirectAuthenticatedUser>
      } loader={loader} />
      <Route path="signup" element={
        <RedirectAuthenticatedUser>
          <SignUp />
        </RedirectAuthenticatedUser>
      } action={signUpaction} />

      <Route path="verify-email" element={
        <RedirectAuthenticatedUser>
          <VerifyEmail />
        </RedirectAuthenticatedUser>
      } />

      <Route path="forgot-password" element={
        <RedirectAuthenticatedUser>
          <ForgotPassword />
        </RedirectAuthenticatedUser>
      } />

      <Route path="reset-password/:token" element={
        <RedirectAuthenticatedUser>
          <ResetPassword />
        </RedirectAuthenticatedUser>
      } />
    </Route>
    <Route path="*" element={<NotFound />} />
  </>

))


export default function App() {
  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
