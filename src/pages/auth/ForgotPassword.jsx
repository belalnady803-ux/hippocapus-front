import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { FaCircleExclamation } from "react-icons/fa6";
import clsx from "clsx";
import Button from "../../components/Button";

const ForgotPassword = () => {
  const { forgotPassword, isLoading, error, message } = useAuthStore();
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setLocalError("Please enter your email address.");
      return;
    }
    setLocalError("");
    try {
      await forgotPassword(email);
    } catch (err) {
      console.error("Forgot password failed:", err);
    }
  };

  return (
    <section className="container max-w-md mx-auto flex flex-col justify-center min-h-screen pt-28 pb-12">
      <div className="bg-p4 dark:bg-[#21262B] p-8 rounded-2xl shadow-lg border border-[#DBE0E5] dark:border-dark-Cs">
        <h1 className="text-3xl font-bold text-p2 dark:text-p4 mb-4 text-center">
          Forgot Password
        </h1>
        <p className="text-p3 dark:text-[#94ABC7] text-center mb-6 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {message}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email-input"
              className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email-input"
              required
              className={clsx(
                "w-full px-4 py-2 border border-[#DBE0E5] dark:border-dark-Cs rounded-lg bg-white dark:bg-[#1A1E22] focus:outline-none focus:ring-2 focus:ring-p1 dark:focus:ring-s2 dark:text-p4 transition-colors",
                (localError || error) && "border-red-500"
              )}
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                setLocalError("");
              }}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            text={isLoading ? "Sending..." : "Send Reset Link"}
            className="w-full mt-2"
          />
        </form>

        {(localError || error) && (
          <div className="flex gap-3 items-center mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <FaCircleExclamation className="text-red-500 flex-shrink-0" />
            <p className="text-red-500 text-sm">{localError || error}</p>
          </div>
        )}

        <div className="text-center mt-6 text-sm">
          <p className="text-p3 dark:text-[#94ABC7]">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-p2 dark:text-p1 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
