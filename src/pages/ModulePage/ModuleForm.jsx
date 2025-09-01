const ModuleForm = ({ formData, isEditing, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Module Details</h3>
      </div>

      <div className="px-6 py-4 space-y-6">
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
            className={`w-full px-3 py-2 border ${
              isEditing ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" : "border-transparent bg-transparent"
            } rounded-md shadow-sm dark:text-white`}
            placeholder="Enter module title"
          />
        </div>
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
            className={`w-full px-3 py-2 border ${
              isEditing ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600" : "border-transparent bg-transparent"
            } rounded-md shadow-sm dark:text-white`}
            placeholder="Enter module price"
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleForm;
