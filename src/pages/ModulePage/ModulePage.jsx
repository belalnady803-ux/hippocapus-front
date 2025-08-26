import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

import ModuleHeader from "./ModuleHeader";
import ModuleForm from "./ModuleForm";
import ModuleTabs from "./ModuleTabs";
import VideosSection from "./VideosSection";
import ResourcesSection from "./ResourcesSection";
import Loader from "./Loader";
import ErrorAlert from "./ErrorAlert";
import AddModule from "./AddModule";
import { API_URL } from "../../store/authStore";

const ModulePage = () => {
  const { courseId, moduleId } = useParams();
  if(moduleId === "new") return <AddModule courseId={courseId} />;
  const navigate = useNavigate();

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("videos");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 0,
    isPublished: false,
  });

  // Determine the API base URL based on the environment

  // Fetch module (with videos inside)
  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}/admin/courses/${courseId}/modules/${moduleId}`
        );
        setModuleData(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          order: data.order || 0,
          isPublished: data.isPublished || false,
        });
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Failed to load module data";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [courseId, moduleId, API_URL]); // Add apiBaseURL as a dependency

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Module title is required");
      return;
    }

    try {
      setSaving(true);
      await axios.put(
        `${API_URL}/admin/courses/${courseId}/modules/${moduleId}`,
        formData
      );
      setModuleData((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
      toast.success("Module updated successfully");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update module";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    try {
      setSaving(true);
      const updatedStatus = !moduleData.isPublished;
      await axios.patch(
        `${API_URL}/admin/courses/${courseId}/modules/${moduleId}/status`,
        { isPublished: updatedStatus }
      );
      setModuleData((prev) => ({ ...prev, isPublished: updatedStatus }));
      setFormData((prev) => ({ ...prev, isPublished: updatedStatus }));
      toast.success(`Module ${updatedStatus ? "published" : "unpublished"} successfully`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update module status";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      setSaving(true);
      await axios.delete(
        `${API_URL}/admin/courses/${courseId}/modules/${moduleId}`
      );
      toast.success("Module deleted successfully");
      navigate(`/admin/courses/${courseId}/edit`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete module";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      title: moduleData.title,
      description: moduleData.description,
      order: moduleData.order,
      isPublished: moduleData.isPublished,
    });
    setIsEditing(false);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24">
      <ModuleHeader
        moduleData={moduleData}
        isEditing={isEditing}
        saving={saving}
        onEditToggle={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancelEdit}
        onDelete={handleDelete}
        onTogglePublish={togglePublish}
      />

      <ModuleForm
        formData={moduleData}
        isEditing={isEditing}
        onChange={handleInputChange}
      />

      <ModuleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "videos" ? (
        <VideosSection
          moduleData={moduleData}
          courseId={courseId}
          moduleId={moduleId}
        />
      ) : (
        <ResourcesSection />
      )}
    </div>
  );
};

export default ModulePage;
