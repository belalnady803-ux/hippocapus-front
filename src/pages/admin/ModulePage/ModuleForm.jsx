import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../store/authStore";
import { FiUser } from "react-icons/fi";

const ModuleForm = ({ formData, isEditing, onChange }) => {
  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    const fetchInstructors = async () => {
      setLoadingInstructors(true);
      try {
        const { data } = await axios.get(`${API_URL}/admin/courses/users/instructors`);
        setInstructors(data.data.instructors || []);
      } catch {
        setInstructors([]);
      } finally {
        setLoadingInstructors(false);
      }
    };
    fetchInstructors();
  }, [isEditing]);

  const inputClass = (editing) =>
    `w-full px-3 py-2 border ${
      editing
        ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
        : "border-transparent bg-transparent"
    } rounded-md shadow-sm dark:text-white`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Module Details</h3>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            disabled={!isEditing}
            className={inputClass(isEditing)}
            placeholder="Enter module title"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            disabled={!isEditing}
            className={inputClass(isEditing)}
            placeholder="Enter module price"
          />
        </div>

        {/* Instructor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <FiUser className="w-4 h-4" /> Instructor
          </label>

          {isEditing ? (
            <select
              name="instructor"
              value={formData.instructor || ""}
              onChange={onChange}
              disabled={loadingInstructors}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">— No instructor assigned —</option>
              {loadingInstructors ? (
                <option disabled>Loading instructors…</option>
              ) : (
                instructors.map((inst) => (
                  <option key={inst._id} value={inst._id}>
                    {inst.fullName} ({inst.email})
                  </option>
                ))
              )}
            </select>
          ) : (
            <p className="px-3 py-2 text-sm text-gray-900 dark:text-white">
              {formData.instructorName || (formData.instructor ? formData.instructor : "—")}
            </p>
          )}
        </div>

        {/* Published */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={onChange}
            disabled={!isEditing}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Published
          </label>
        </div>
      </div>
    </div>
  );
};

export default ModuleForm;
