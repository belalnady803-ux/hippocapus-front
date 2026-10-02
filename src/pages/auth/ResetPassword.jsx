import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { FaCircleExclamation } from "react-icons/fa6";
import clsx from "clsx";
import Button from "../../components/Button";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error } = useAuthStore();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }
    setLocalError("");
    try {
      await resetPassword(token, password);
      setSuccess(true);
      // Optionally redirect after a few seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset password failed:", err);
    }
  };

  return (
    <section className="container max-w-md mx-auto flex flex-col justify-center min-h-screen pt-28 pb-12">
      <div className="bg-p4 dark:bg-[#21262B] p-8 rounded-2xl shadow-lg border border-[#DBE0E5] dark:border-dark-Cs">
        <h1 className="text-3xl font-bold text-p2 dark:text-p4 mb-4 text-center">
          Reset Password
        </h1>
        
        {success ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-sm">
              Your password has been successfully reset!
            </div>
            <Link to="/login">
              <Button text="Go to Login" className="w-full" />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-p3 dark:text-[#94ABC7] text-center mb-6 text-sm">
              Please enter your new password below.
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password-input"
                  className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-1"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password-input"
                  required
                  className={clsx(
                    "w-full px-4 py-2 border border-[#DBE0E5] dark:border-dark-Cs rounded-lg bg-white dark:bg-[#1A1E22] focus:outline-none focus:ring-2 focus:ring-p1 dark:focus:ring-s2 dark:text-p4 transition-colors",
                    (localError || error) && "border-red-500"
                  )}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.currentTarget.value);
                    setLocalError("");
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password-input"
                  className="block text-sm font-medium text-p3 dark:text-[#94ABC7] mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirm-password-input"
                  required
                  className={clsx(
                    "w-full px-4 py-2 border border-[#DBE0E5] dark:border-dark-Cs rounded-lg bg-white dark:bg-[#1A1E22] focus:outline-none focus:ring-2 focus:ring-p1 dark:focus:ring-s2 dark:text-p4 transition-colors",
                    (localError || error) && "border-red-500"
                  )}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.currentTarget.value);
                    setLocalError("");
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                text={isLoading ? "Resetting..." : "Reset Password"}
                className="w-full mt-2"
              />
            </form>

            {(localError || error) && (
              <div className="flex gap-3 items-center mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <FaCircleExclamation className="text-red-500 flex-shrink-0" />
                <p className="text-red-500 text-sm">{localError || error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ResetPassword;
