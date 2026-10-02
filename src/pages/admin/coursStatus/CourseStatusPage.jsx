import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../../store/authStore.js";
import { useParams } from 'react-router';
import ModuleStatusPage from './ModuleStatusPage.jsx';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiUserPlus } from 'react-icons/fi';

const CourseStatus = () => {
    const [users, setUsers] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [enrolling, setEnrolling] = useState(false);
    
    // The param is named 'id' in App.jsx but it receives the 'slug'
    const { id: slug } = useParams();

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            // Fetch Course details to get the modules
            const courseRes = await axios.get(`${API_URL}/admin/courses/${slug}`);
            setModules(courseRes.data.data.modules || []);

            // Fetch Course Enrollments
            const enrollRes = await axios.get(`${API_URL}/admin/courses/${slug}/enrollments`);
            setUsers(enrollRes.data.data.enrolledUsers || []);
            
            setError(null);
        } catch (err) {
            setError('Failed to fetch course data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchCourseData();
    }, [slug]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserEmail) return;
        
        try {
            setEnrolling(true);
            await axios.post(`${API_URL}/admin/courses/${slug}/enrollments`, { email: newUserEmail });
            toast.success("User enrolled successfully!");
            setNewUserEmail('');
            fetchCourseData(); // Refresh list
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to enroll user");
        } finally {
            setEnrolling(false);
        }
    };

    const handleRemoveUser = async (userId, userEmail) => {
        if (!window.confirm(`Are you sure you want to remove ${userEmail} from this course?`)) return;
        
        try {
            await axios.delete(`${API_URL}/admin/courses/${slug}/enrollments/${userId}`);
            toast.success("User removed successfully!");
            setUsers(users.filter(u => u.userId !== userId));
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to remove user");
        }
    };

    if (loading) return <div className="text-center pt-24">Loading...</div>;
    if (error) return <div className="text-center pt-24 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-24 grid grid-cols-1 gap-8 lg:gap-12">
            <div>
                <h2 className='font-bold text-2xl text-center mb-4 dark:text-white'>Course Enrollments</h2>
                
                {/* Add User Form */}
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
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
                                {users.length > 0 ? users.map((user) => (
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
                                            No users enrolled in this course directly.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Render a table for each module */}
            {modules.map((module) => (
                <ModuleStatusPage 
                    key={module._id} 
                    slug={slug} 
                    moduleId={module._id} 
                    moduleTitle={module.title} 
                />
            ))}
        </div>
    );
};

export default CourseStatus;
