import { FiArrowLeft, FiEdit, FiSave, FiX, FiTrash2, FiLock, FiUnlock } from "react-icons/fi";
import { useNavigate } from "react-router";

const ModuleHeader = ({ moduleData, isEditing, saving, onEditToggle, onSave, onCancel, onDelete, onTogglePublish }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mb-4"
        >
          <FiArrowLeft className="mr-1" /> Back to Course
        </button>

        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Module" : moduleData.title}
          </h1>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              moduleData.isPublished
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {moduleData.isPublished ? "Published" : "Draft"}
          </span>
        </div>

        {!isEditing && moduleData.order && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Module {moduleData.order}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!isEditing ? (
          <>
            <button
              onClick={onEditToggle}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <FiEdit className="mr-1.5 h-4 w-4" /> Edit
            </button>

            <button
              onClick={onTogglePublish}
              disabled={saving}
              className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md shadow-sm transition-colors ${
                moduleData.isPublished
                  ? "border-red-300 text-red-700 bg-white hover:bg-red-50"
                  : "border-green-300 text-green-700 bg-white hover:bg-green-50"
              }`}
            >
              {moduleData.isPublished ? (
                <>
                  <FiLock className="mr-1.5 h-4 w-4" /> Unpublish
                </>
              ) : (
                <>
                  <FiUnlock className="mr-1.5 h-4 w-4" /> Publish
                </>
              )}
            </button>

            <button
              onClick={onDelete}
              disabled={saving}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 transition-colors"
            >
              <FiTrash2 className="mr-1.5 h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onCancel}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <FiX className="mr-1.5 h-4 w-4" /> Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <FiSave className="mr-1.5 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModuleHeader;
