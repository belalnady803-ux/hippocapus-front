import { Form, redirect, useActionData, useNavigation, Link } from "react-router";
import { FaCircleExclamation } from "react-icons/fa6";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import registerPhoto from "../../assets/register photo.jpg";
import Button from "../../components/Button";
import { useAuthStore } from "../../store/authStore.js";
import { useNavigate } from "react-router";
import { useState } from "react";
export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("name");
  const phoneNumber = formData.get("phone");
  const { signup } = useAuthStore.getState(); // ✅ grab directly
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof fullName !== "string" ||
    typeof phoneNumber !== "string"
  ) {
    return "Invalid form data. Please fill out all fields correctly.";
  }

  try {
    // `signup` (in the zustand store) returns `response.data` from axios.
    // That object typically contains { user, message } (no `success` flag),
    // so check for a `user` to determine success.
    const response = await signup(email, password, fullName, phoneNumber);

    if (response && (response.user || (response.data && response.data.user))) {
      return redirect("/verify-email");
    }

    // If backend returned a message but no user, surface it to the form.
    if (response && typeof response.message === "string") {
      return response.message;
    }

    return "Signup failed. Please try again.";
  } catch (err) {
    // axios throws an error object where the server message often lives at
    // `err.response.data.message`. `err.message` is often "Request failed with status code 400",
    // which is what the UI was showing. Prefer the backend message when available.
    const backendMessage = err?.response?.data?.message || err?.response?.data || null;
    if (backendMessage && typeof backendMessage === "string") return backendMessage;

    if (err instanceof Error) return err.message;

    try {
      return JSON.stringify(err);
    } catch {
      return "An unexpected error occurred.";
    }
  }
}

const SignUp = () => {
  const navigation = useNavigation();
  const actionData = useActionData(); // Use a more descriptive name
  const navigate = useNavigate();
  const { googleLogin } = useAuthStore();
  const [localError, setLocalError] = useState("");

  const error = typeof actionData === 'string' ? actionData : (localError || null);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin(tokenResponse.access_token);
        navigate("/");
      } catch (err) {
        const backendMessage = err?.response?.data?.message || err?.message || "Google Signup failed";
        setLocalError(typeof backendMessage === "string" ? backendMessage : JSON.stringify(backendMessage));
        console.error("Google Signup failed:", err);
      }
    },
    onError: () => {
      setLocalError("Google Signup was unsuccessful. Try again.");
    }
  });

  return (
    <section className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-screen pt-28">
      {/* Column 1: The Form */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-2 dark:text-p4">Create Your Account</h1>
        <p className="text-p3 dark:text-[#94ABC7] mb-6">
          Enter your information to get started with Hippocampus.
        </p>
        <Form className="flex flex-col gap-5 pt-8 pb-4" method="POST" replace>
          {/* ... Name Input ... */}
          <div>
            <label
              htmlFor="name-input"
              className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-2"
            >
              Full Name
            </label>
            <input
              id="name-input"
              type="text"
              name="name"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="e.g., John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="phone-input"
              className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone-input"
              type="tel" // Use type="tel" for phone numbers
              name="phone"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="e.g., +1234567890"
            />
          </div>
          <div>
            <label
              htmlFor="email-input"
              className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-2"
            >
              Email
            </label>
            <input
              id="email-input"
              type="email"
              name="email"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password-input"
              className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-2"
            >
              password
            </label>
            <input
              id="password-input"
              type="password"
              name="password"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>
          <Button
            type="submit"
            disabled={navigation.state === "submitting"}
            className="w-full h-auto py-3 rounded-md" // Overriding strict height to match original feel if needed, but sticking to Button's style mostly.
            text={navigation.state === "submitting" ? "Registering..." : "Sign Up"}
          />
        </Form>

        {/* TODO: Google Login - To be implemented in next update */}
        {/* <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>
        </div> */}

        {error && (
          <div className="flex gap-4 items-center pl-4">
            <FaCircleExclamation className="text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="text-center mt-6 text-sm">
          <p className="text-p3 dark:text-[#94ABC7]">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-p2 dark:text-p1 hover:underline">
              Log in now
            </Link>
          </p>
        </div>
      </div>
      {/* ... Column 2: The Image ... */}
      <div className="hidden md:flex items-center justify-center">
        {/* Your illustration or image component goes here */}

        <div className="w-full  bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">

          <img src={registerPhoto} alt="register photo" className="rounded-2xl" />

        </div>

      </div>
    </section>
  );
};

export default SignUp;
