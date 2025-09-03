import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authStore.js';
import { useParams } from 'react-router';
import ModuleStatusPage from './ModuleStatusPage.jsx';

const CourseStatus = () => {
    const [users, setUsers] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchSubscribedUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/admin/courses/${id}/getFullySubscribedUser`);
                setUsers(response.data.users);
                setModules(response.data.modules);
                setError(null);
            } catch (err) {
                setError('Failed to fetch subscribed users.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchSubscribedUsers();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="container mx-auto px-4 py-24 grid grid-cols-1 gap-8 lg:gap-12">
            {/* this table for user subscribed to the hole course  */}
            <h2 className='font-bold text-2xl text-center mb-4 dark:text-white'>Subscribed Users</h2>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap"> 
                    <div className="text-sm text-gray-900 dark:text-white">{user.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="text-sm text-gray-900 dark:text-white">{user.phoneNumber}</div>
                  </td>
                </tr>
              ))}
            <tr className="bg-gray-50 dark:bg-gray-700 ">
                <td className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                    <span className="text-secondary">Users subscribed to this course</span> : {users.length}
                </td>
            </tr>
            </tbody>
          </table>
        </div>
        </div>
        {/* here we will a create a simirlar table for evry module in the course */}
            {modules.map((module) => (
                <ModuleStatusPage key= {module._id} moduleId = {module._id} moduleTitle = {module.title} />
            ))}
        </div>
    );
};

export default CourseStatus;
