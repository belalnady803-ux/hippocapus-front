import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authStore';

// It's a good practice to have the API URL in a central place or environment variable

const CourseStatus = () => {
    const [email, setEmail] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch all courses for the dropdown menu when the component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/courses/`);
                // Assuming the API returns an array of course objects { id, title }
                setCourses(response.data || []);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch courses. Please try again later.';
                setError(errorMessage);
                console.error('Fetch courses error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []); // The empty dependency array ensures this effect runs only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !selectedCourse) {
            setError('Please enter a user email and select a course.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage('');

        try {
            console.log(selectedCourse)
            const response = await axios.post(`${API_URL}/admin/courses/addSubscribedUser`, {
                email,
                courseId: selectedCourse,
            });


            setSuccessMessage(response.data.message || 'User successfully subscribed to the course!');
            // Reset form fields on success
            setEmail('');
            setSelectedCourse('');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred while subscribing the user.';
            setError(errorMessage);
            console.error('Subscribe user error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-24 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-dark-Bg">
            <div className="bg-white dark:bg-[#21262B] rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">
                    Subscribe User to a Course
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
                            User Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter user's email"
                            required
                            disabled={isSubmitting}
                            className="border border-gray-300 dark:border-dark-Cs rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-gray-100 dark:bg-dark-Bg text-black dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="course-select" className="text-sm font-medium text-black dark:text-white">
                            Course
                        </label>
                        <select
                            id="course-select"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            required
                            disabled={isLoading || isSubmitting}
                            className="border border-gray-300 dark:border-dark-Cs rounded-lg px-4 py-2 bg-gray-100 dark:bg-dark-Bg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        >
                            <option value="" disabled>
                                {isLoading ? 'Loading courses...' : 'Select a course'}
                            </option>
                            {courses.map((course) => (
                                <option key={course.id} value={course._id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="bg-primary text-white font-semibold py-2 rounded-lg shadow hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe User'}
                    </button>
                </form>
                {error && <p className="mt-4 text-red-600 text-center font-medium">{error}</p>}
                {successMessage && <p className="mt-4 text-green-600 text-center font-medium">{successMessage}</p>}
            </div>
        </div>
    );
};

export default CourseStatus;
