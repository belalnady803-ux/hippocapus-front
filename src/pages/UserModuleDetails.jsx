import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../store/authStore";


const UserModuleDetails = () => {
    const {id , moduleId} = useParams();
    const [videos, setVideos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!id || !moduleId) {
            setError("Course or Module ID not found in URL.");
            setLoading(false);
            return;
        }
        const fetchModule = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/courses/${id}/modules/${moduleId}`);
                console.log(res.data);
                setVideos(res.data.data);
            } catch (err) {
                setError("Failed to fetch module details.");
            } finally {
                setLoading(false);
            }
        };
        fetchModule();
    }, [id, moduleId]);

    const handleVideoClick = (videoId) => {
        navigate(`/my-courses/${id}/${moduleId}/videos/${videoId}?preview=false`);
    };

    if (loading) return <div className="pt-24 text-center">Loading...</div>;
    if (error) return <div className="pt-24 text-center text-red-600">{error}</div>;
    if (!videos) return null;

    return (
        <div className="pt-24 px-4 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Videos</h3>
            <ul className="flex flex-col gap-3">
                {videos && videos.length > 0 ? (
                    videos.map((video) => (
                        <li
                            key={video._id}
                            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between cursor-pointer transition "
                            onClick={() => handleVideoClick(video._id)}
                        >
                            <span className="font-medium">{video.title}</span>
                            <button
                                className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark transition cursor-pointer"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleVideoClick(video._id);
                                }}
                            >
                                {/* Simple play icon SVG */}
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6 4l10 6-10 6V4z"/>
                                </svg>
                                <span className="text-sm font-semibold">Watch Now</span>
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No videos available.</li>
                )}
            </ul>
        </div>
    );
};

export default UserModuleDetails;