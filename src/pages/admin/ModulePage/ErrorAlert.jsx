
const ErrorAlert = ({ message }) => (
  <div className="max-w-2xl mx-auto mt-20 p-6 bg-red-100 dark:bg-red-800 rounded-lg text-red-700 dark:text-red-200">
    <h3 className="font-medium">Error</h3>
    <p className="mt-1 text-sm">{message}</p>
  </div>
);

export default ErrorAlert;
