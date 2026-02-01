import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { FiEdit } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { API_URL } from '../store/authStore';

const EditCourse = () => {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const [addUserMessage, setAddUserMessage] = useState('');
  const [addUserFailed, setAddUserFailed] = useState('');
  const [removeUserMessage, setRemoveUserMessage] = useState('');
  const [removeUserFailed, setRemoveUserFailed] = useState('');


  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    modules: [],
    instructors: [],
    reviews: [],
    level: "0",
  });

  const [editableFields, setEditableFields] = useState({
    title: false,
    description: false,
    price: false,
    image: false,
    level: false,
  });

  const [loading, setLoading] = useState(false);

  // Determine the API base URL based on the environment

  // Fetch course on mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/courses/${id}`);
        console.log(data);
        setCourseData({
          title: data.data.title || "",
          description: data.data.description || "",
          price: data.data.price || "",
          image: data.data.image || "",
          level: data.data.level || "0",
          modules: data.data.modules || [],
          instructors: data.data.instructors || [],
          reviews: data.data.reviews || [],
        });
      } catch (error) {
        console.error("Failed to fetch course:", error);
        alert("Failed to load course data.");
      }
    };
    fetchCourse();
  }, [id, API_URL]); // Add apiBaseURL as a dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const toggleEdit = (field) => {
    setEditableFields({ ...editableFields, [field]: !editableFields[field] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: courseData.title,
        description: courseData.description,
        price: Number(courseData.price) || 0,
        image: courseData.image,
        level: courseData.level,
      };
      await axios.put(`${API_URL}/admin/courses/${id}`, payload);
      alert("Course updated successfully!");
    } catch (error) {
      console.error("Failed to update course:", error);
      alert("Failed to update course.");
    } finally {
      setLoading(false);
    }
  };
  const addUserToCourse = async () => {
    const email = document.getElementById('add-user').value;
    try {
      if (!email) {
        alert('Please enter a user email.');
        return;
      }
      const response = await axios.post(`${API_URL}/admin/courses/addSubscribedUser`, {
        email,
        courseId: id,
      });
      setAddUserFailed(response.data.message);
      document.getElementById('add-user').value = '';
    } catch (error) {
      console.error(error);
      setAddUserFailed('Failed to add user to the course.');
    }
  };
  const removeUserFromCourse = async () => {
    const email = document.getElementById('remove-user').value;
    try {
      if (!email) {
        alert('Please enter a user email.');
        return;
      }
      const response = await axios.post(`${API_URL}/admin/courses/removeSubscribedUser`, {
        email,
        courseId: id,
      });
      setRemoveUserMessage(response.data.message);
      document.getElementById('remove-user').value = '';
    } catch (error) {
      console.error(error);
      setRemoveUserFailed('Failed to remove user from the course.');
    }
  };

  const inputBase = "w-full px-4 py-2 border rounded-lg transition";
  const inputEnabled = "outline-none border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white";
  const inputDisabled = "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed";

  const getInputClassName = (isDisabled) =>
    `${inputBase} ${isDisabled ? inputDisabled : inputEnabled}`;

  return (
    <div className="container mx-auto max-w-3xl px-4 pt-24">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
          Edit Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title, Description, Price, Image */}
          {["title", "description", "price", "image"].map((field) => (
            <div key={field}>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={courseData[field]}
                  onChange={handleChange}
                  className={`${getInputClassName(!editableFields[field] || loading)} ${!editableFields[field] ? 'opacity-75' : ''}`}
                  rows={4}
                  disabled={!editableFields[field] || loading}
                />
              ) : (
                <input
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  value={courseData[field]}
                  onChange={handleChange}
                  className={`${getInputClassName(!editableFields[field] || loading)} ${!editableFields[field] ? 'opacity-75' : ''}`}
                  disabled={!editableFields[field] || loading}
                />
              )}
              <button
                type="button"
                onClick={() => toggleEdit(field)}
                className="ml-2 text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FiEdit className="mr-1" />
                {editableFields[field] ? "Lock" : "Edit"}
              </button>
              {field === "image" && courseData.image && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={courseData.image}
                    alt="Preview"
                    className="h-24 w-auto rounded shadow border border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
            </div>
          ))}

          {/* Level (Separate because it is a select) */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Level
            </label>
            <div className="flex items-center">
              <select
                name="level"
                value={courseData.level}
                onChange={handleChange}
                className={`${getInputClassName(!editableFields.level || loading)} ${!editableFields.level ? 'opacity-75' : ''}`}
                disabled={!editableFields.level || loading}
              >
                <option value={0}>Level 0</option>
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
              </select>
              <button
                type="button"
                onClick={() => toggleEdit('level')}
                className="ml-2 text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FiEdit className="mr-1" />
                {editableFields.level ? "Lock" : "Edit"}
              </button>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Modules
              </label>
              <button
                type="button"
                onClick={() => navigate(`/admin/courses/${id}/modules/new`)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                <FiPlus className="mr-1" /> Add Module
              </button>
            </div>
            {courseData.modules && courseData.modules.length > 0 ? (
              <ul className="space-y-2">
                {courseData.modules.map((m) => (
                  <li
                    key={m._id}
                    className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <span className="text-gray-800 dark:text-gray-200">{m.title || 'Untitled Module'}</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/courses/${id}/modules/${m._id}`)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Manage
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-3">No modules added yet</p>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/courses/${id}/modules/new`)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2" /> Add Your First Module
                </button>
              </div>
            )}
          </div>

          {/* Instructors */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Instructors
              </label>
              <button
                type="button"
                onClick={() => navigate(`/admin/courses/${id}/instructors/add`)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                <FiPlus className="mr-1" /> Add Instructor
              </button>
            </div>
            {courseData.instructors && courseData.instructors.length > 0 ? (
              <ul className="space-y-2">
                {courseData.instructors.map((i) => (
                  <li
                    key={i._id}
                    className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800 dark:text-gray-200">{i.name || 'Unnamed Instructor'}</span>
                      {i.image && (
                        <img
                          src={i.image}
                          alt={i.name}
                          className="h-6 w-6 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to remove ${i.name || 'this instructor'}?`)) {
                          try {
                            await axios.delete(
                              `${API_URL}/admin/courses/${id}/instructor/${i._id}`,
                            );
                            // Update the local state to remove the instructor
                            setCourseData(prev => ({
                              ...prev,
                              instructors: prev.instructors.filter(instructor => instructor._id !== i._id)
                            }));
                            alert('Instructor removed successfully!');
                          } catch (error) {
                            console.error('Error removing instructor:', error);
                            alert('Failed to remove instructor. Please try again.');
                          }
                        }
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-3">No instructors assigned yet</p>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/courses/${id}/instructors/add`)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2" /> Add Instructor
                </button>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Reviews
              </label>
              <button
                type="button"
                onClick={() => navigate(`/admin/courses/${id}/reviews`)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                View All
              </button>
            </div>
            {courseData.reviews && courseData.reviews.length > 0 ? (
              <ul className="space-y-2">
                {courseData.reviews.slice(0, 3).map((r) => (
                  <li
                    key={r._id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{r.user?.fullName || 'Anonymous'}</span>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < (r.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">({r.rating}/5)</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">"{r.comment}"</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/reviews/${r._id}`)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))}
                {courseData.reviews.length > 3 && (
                  <li className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/courses/${id}/reviews`)}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View all {courseData.reviews.length} reviews
                    </button>
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
              </div>
            )}
          </div>

          {/* add user to this course */}
          <label htmlFor="add-user" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Add User
          </label>
          <input
            type="text"
            id="add-user"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button type="button" onClick={addUserToCourse} className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add User to this course
          </button>
          {addUserMessage && <p className="mt-2 text-green-600 font-medium">{addUserMessage}</p>}
          {addUserFailed && <p className="mt-2 text-red-600 font-medium">{addUserFailed}</p>}
          {/* remove user form this course */}
          <label htmlFor="remove-user" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            remove User
          </label>
          <input
            type="text"
            id="remove-user"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button type="button" onClick={removeUserFromCourse} className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            remove User from this course
          </button>
          {removeUserMessage && <p className="mt-2 text-green-600 font-medium">{removeUserMessage}</p>}
          {removeUserFailed && <p className="mt-2 text-red-600 font-medium">{removeUserFailed}</p>}

          <div className="space-y-3"></div>


          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default EditCourse;
