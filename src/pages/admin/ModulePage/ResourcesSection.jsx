import React from "react";
import { FiFileText } from "react-icons/fi";

const ResourcesSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8 px-6 py-8 text-center">
      <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No resources</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Resources feature coming soon.</p>
    </div>
  );
};

export default ResourcesSection;
