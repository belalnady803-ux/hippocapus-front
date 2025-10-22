import { Link } from "react-router";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation/Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-indigo-600 mb-4 animate-pulse">
            404
          </div>
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-indigo-200 rounded-full animate-bounce"></div>
            <div className="absolute inset-2 bg-indigo-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="absolute inset-4 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
            
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Still can't find what you're looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <Link
                to="/courses"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                Browse Courses
              </Link>
              <span className="hidden sm:inline text-gray-300">•</span>
              <Link
                to="/contact"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                Contact Support
              </Link>
              <span className="hidden sm:inline text-gray-300">•</span>
              <Link
                to="/faq"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
          <p className="text-xs text-gray-600 italic">
            💡 Fun fact: The first 404 error was recorded at CERN in 1992!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
