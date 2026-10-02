import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../../store/authStore.js";
import { toast } from 'react-hot-toast';
import { FiTrash2, FiUserPlus } from 'react-icons/fi';

const ModuleStatusPage = ({ slug, moduleId, moduleTitle }) => {
    const [users, setUsers] = useState([]);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [enrolling, setEnrolling] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchModuleUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/courses/${slug}/modules/${moduleId}/enrollments`);
            setUsers(response.data.data.enrolledUsers || []);
        } catch (err) {
            console.error('Failed to fetch module enrollments', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModuleUsers();
    }, [slug, moduleId]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserEmail) return;
        
        try {
            setEnrolling(true);
            await axios.post(`${API_URL}/admin/courses/${slug}/modules/${moduleId}/enrollments`, { email: newUserEmail });
            toast.success("User enrolled in module successfully!");
            setNewUserEmail('');
            fetchModuleUsers(); // Refresh list
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to enroll user in module");
        } finally {
            setEnrolling(false);
        }
    };

    const handleRemoveUser = async (userId, userEmail) => {
        if (!window.confirm(`Are you sure you want to remove ${userEmail} from this module?`)) return;
        
        try {
            await axios.delete(`${API_URL}/admin/courses/${slug}/modules/${moduleId}/enrollments/${userId}`);
            toast.success("User removed from module successfully!");
            setUsers(users.filter(u => u.userId !== userId));
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to remove user from module");
        }
    };

    return (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className='font-bold text-xl text-center mb-4 dark:text-white'>Enrollments for {moduleTitle}</h3>
            
            {/* Add User Form for Module */}
            <form onSubmit={handleAddUser} className="mb-6 flex gap-2 justify-center max-w-lg mx-auto">
                <input 
                    type="email" 
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button 
                    type="submit" 
                    disabled={enrolling}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                    <FiUserPlus />
                    {enrolling ? 'Adding...' : 'Add User'}
                </button>
            </form>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Full Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length > 0 ? users.map((user) => (
                                <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap"> 
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleRemoveUser(user.userId, user.email)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center justify-end w-full gap-1"
                                        >
                                            <FiTrash2 /> Remove
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No users enrolled in this module directly.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ModuleStatusPage;
