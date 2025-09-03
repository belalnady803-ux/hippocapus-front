import { API_URL } from "../../store/authStore"
import axios from "axios"
import { useState , useEffect } from "react"

const ModuleStatus = ({moduleId , moduleTitle}) => {
    const [users, setUsers] = useState([])
    useEffect(() => {
        async function getFullySubscribedUserInModule(moduleId) {
        try{
            const response = await axios.get(`${API_URL}/admin/courses/getSubscribedUser/${moduleId}` , {
            })
            setUsers(response.data.users)
        }catch(err){
            console.log(err)
        }  
    }
    getFullySubscribedUserInModule(moduleId)
    , [moduleId]})
return (
    <>
        <h2 className='font-bold text-2xl text-center mb-4 dark:text-white'>Subscribed Users to {moduleTitle}</h2>
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
    </>
  )
}

export default ModuleStatus
