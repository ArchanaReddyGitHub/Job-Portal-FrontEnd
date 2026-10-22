
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Briefcase, Building2 } from "lucide-react";

export default function Onboarding() {
    const { user, isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    if (!isLoaded) {
        return <p className="text-center p-10">Loading...</p>;
    }

    if (!isSignedIn || !user) {
        return <Navigate to="/auth" replace />;
    }

    const existingRole = user.unsafeMetadata?.role;

    if (existingRole === "candidate") {
        return <Navigate to="/candidate-dashboard" replace />;
    }

    if (existingRole === "recruiter") {
        return <Navigate to="/recruiter-dashboard" replace />;
    }

    const selectRole = async (role) => {
        if (saving) return;

        setSaving(true);
        setError("");

        try {
            await user.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    role,
                },
            });

            await user.reload();

            navigate(
                role === "recruiter"
                    ? "/recruiter-dashboard"
                    : "/candidate-dashboard",
                { replace: true }
            );
        } catch (err) {
            console.error("Role selection failed:", err);
            setError("Unable to save your account type. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="mx-auto max-w-4xl py-12 px-4">
            <h1 className="text-center text-4xl font-bold">
                Welcome to Hired
            </h1>

            <p className="mt-3 text-center text-gray-500">
                Choose your account type to continue.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
                <button
                    type="button"
                    disabled={saving}
                    onClick={() => selectRole("candidate")}
                    className="rounded-xl border p-8 text-center hover:border-blue-500 disabled:opacity-50"
                >
                    <Briefcase className="mx-auto mb-4" size={40} />
                    <h2 className="text-2xl font-bold">Candidate</h2>
                    <p className="mt-3 text-gray-500">
                        Search jobs, save favorites, apply, and track applications.
                    </p>
                </button>

                <button
                    type="button"
                    disabled={saving}
                    onClick={() => selectRole("recruiter")}
                    className="rounded-xl border p-8 text-center hover:border-green-500 disabled:opacity-50"
                >
                    <Building2 className="mx-auto mb-4" size={40} />
                    <h2 className="text-2xl font-bold">Recruiter</h2>
                    <p className="mt-3 text-gray-500">
                        Post jobs, manage openings, and review applications.
                    </p>
                </button>
            </div>

            {error && (
                <p className="mt-6 text-center text-red-500">
                    {error}
                </p>
            )}
        </section>
    );
}
