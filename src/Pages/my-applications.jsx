
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCandidateApplications } from "../utils/applicationStore";

const statusColors = {
    Applied: "bg-blue-100 text-blue-700",
    Interview: "bg-purple-100 text-purple-700",
    Selected: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
};

export default function MyApplications() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        if (!user?.id) return;

        const refresh = () => {
            setApplications(getCandidateApplications(user.id));
        };

        refresh();

        window.addEventListener("applications-updated", refresh);
        window.addEventListener("storage", refresh);

        return () => {
            window.removeEventListener("applications-updated", refresh);
            window.removeEventListener("storage", refresh);
        };
    }, [user?.id]);

    return (
        <main className="mx-auto max-w-5xl py-10">
            <h1 className="mb-8 text-4xl font-bold">
                My Applications
            </h1>

            {applications.length === 0 ? (
                <div className="rounded-xl border p-8 text-center">
                    <p>You haven't applied for any jobs yet.</p>
                    <Link
                        to="/jobs"
                        className="mt-4 inline-block text-blue-600"
                    >
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5"
                        >
                            <div>
                                <h2 className="text-xl font-bold">
                                    {app.job_title}
                                </h2>

                                <p className="text-gray-500">
                                    {app.company}
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    Applied:{" "}
                                    {new Date(app.appliedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${statusColors[app.status] ||
                                    statusColors.Applied
                                    }`}
                            >
                                {app.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
