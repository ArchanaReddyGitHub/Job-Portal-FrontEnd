
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRole,
}) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p className="p-10 text-center">Loading...</p>;
    }

    if (!user) {
        return (
            <Navigate
                to="/auth"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    if (!user.role) {
        return <Navigate to="/onboarding" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return (
            <Navigate
                to={
                    user.role === "recruiter"
                        ? "/recruiter-dashboard"
                        : "/candidate-dashboard"
                }
                replace
            />
        );
    }

    return children;
}
