import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FiPlus } from "react-icons/fi";
import { API_URL } from '../store/authStore';


const AddCourse = () => {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...courseData,
        price: Number(courseData.price) || 0,
      };

      await axios.post(`${API_URL}/admin/courses`, payload);
      alert("Course added successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const className =
    "w-full outline-none px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition";

  return (
    <div className="container mx-auto max-w-2xl px-4 pt-24">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
          Add New Course
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
          Fill in the details below to add a new course to the academy.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              className={className}
              required
              placeholder="Course title"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              className={className}
              rows={4}
              required
              placeholder="Course description"
              disabled={loading}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Price (SAR)
            </label>
            <input
              type="number"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              className={className}
              required
              placeholder="e.g. 299"
              disabled={loading}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={courseData.image}
              onChange={handleChange}
              className={className}
              required
              placeholder="https://..."
              disabled={loading}
            />
            {courseData.image && (
              <div className="mt-2 flex justify-center">
                <img
                  src={courseData.image}
                  alt="Preview"
                  className="h-24 w-auto rounded shadow border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>


          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Add Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
