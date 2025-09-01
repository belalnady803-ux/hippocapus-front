import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import  toast  from "react-hot-toast";
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
    isPublished: false,
    price : "",
  });
  const [addEmail, setAddEmail] = useState("");
  const [removeEmail, setRemoveEmail] = useState("");

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
          isPublished: data.isPublished || false,
          price : data.price || ""
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
      isPublished: moduleData.isPublished,
      price : moduleData.price
    });
    setIsEditing(false);
  };

  const handleAddUser = async () => {
    if (!addEmail) {
      toast.error("Please enter an email to add.");
      return;
    }
    try {
      await axios.post(`${API_URL}/admin/courses/${courseId}/modules/${moduleId}/subscribedUser`, { email: addEmail });
      toast.success("User added to this module!");
      setAddEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add user to this module."
      );
    }
  };

  const handleRemoveUser = async () => {
    if (!removeEmail) {
      toast.error("Please enter an email to remove.");
      return;
    }
    try {
      await axios.post(`${API_URL}/admin/courses/${courseId}/modules/${moduleId}/unsubscribedUser`, { email: removeEmail });
      toast.success("User removed from this module!");
      setRemoveEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to remove user from this module."
      );
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24">
      {/* Make sure <Toaster /> is rendered in your root App.jsx */}
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
      {/* Pass formData, not moduleData */}
      <ModuleForm
        formData={formData}
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
      {/* add user to this module , or remove from this module */}
      <div className="flex gap-8 mt-8">
        <div className="flex flex-col gap-2">
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
            onClick={handleAddUser}
          >
            Add User to Module
          </button>
          <input
            type="email"
            value={addEmail}
            onChange={e => setAddEmail(e.target.value)}
            placeholder="Enter user email"
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            onClick={handleRemoveUser}
          >
            Remove User from Module
          </button>
          <input
            type="email"
            value={removeEmail}
            onChange={e => setRemoveEmail(e.target.value)}
            placeholder="Enter user email"
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
