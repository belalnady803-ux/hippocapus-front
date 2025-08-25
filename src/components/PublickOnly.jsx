// components/PublicOnlyRoute.jsx
import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    if (isLoading) return <p>Loading...</p>;
    return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;
