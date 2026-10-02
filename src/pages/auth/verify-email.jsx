import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore"; // <-- Your store

const VerifyEmailPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { verifyEmail, isLoading, error, user } = useAuthStore();

  const handleChange = (index, value) => {
    // Modify to only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (!pastedData) return;

    // Extract only digits
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, 6);

    if (digits.length === 0) return;

    const newCode = [...code];
    digits.forEach((digit, i) => {
      newCode[i] = digit;
    });

    setCode(newCode);

    // Focus the next empty slot or the last one
    const nextIndex = digits.length < 6 ? digits.length : 5;
    inputRefs.current[nextIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    console.log(fullCode);
    try {
      await verifyEmail(user?.email, fullCode);
      navigate("/");
    } catch (err) {
    }
  };

  useEffect(() => {
    if (code.every((c) => c !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Verify Your Email
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Enter the 6-digit code sent to your email.
          <br />
          <span className="text-sm text-gray-400">
            If you didn't receive the email, please check your spam folder.
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                inputMode="numeric"
                maxLength="1"
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || code.some((c) => !c)}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
