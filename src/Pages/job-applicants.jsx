
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getJobs } from "@/utils/localDb";
import {
    getJobApplications,
    updateApplicationStatus,
    APPLICATION_STATUSES,
} from "@/utils/applicationStore";

export default function JobApplicants() {
    const { id } = useParams();
    const { user } = useAuth();

    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");

    const job = getJobs().find(
        (item) => String(item.id) === String(id)
    );

    const isOwner =
        user?.role === "recruiter" &&
        job?.recruiter_id === user.id;

    useEffect(() => {
        if (!isOwner) return;

        const refresh = () => {
            setApplications(getJobApplications(id, user.id));
        };

        refresh();
        window.addEventListener("applications-updated", refresh);
        window.addEventListener("storage", refresh);

        return () => {
            window.removeEventListener("applications-updated", refresh);
            window.removeEventListener("storage", refresh);
        };
    }, [id, user?.id, isOwner]);

    const handleStatusChange = (applicationId, status) => {
        try {
            setError("");

            updateApplicationStatus(
                applicationId,
                user.id,
                status
            );
        } catch (err) {
            setError(err.message);
        }
    };

    if (!isOwner) {
        return (
            <p className="p-10 text-center">
                Job not found or access denied.
            </p>
        );
    }

    return (
        <main className="mx-auto max-w-5xl py-10">
            <Link to="/my-jobs" className="text-blue-600">
                ← Back to My Jobs
            </Link>

            <h1 className="mt-6 text-4xl font-bold">
                Job Applicants
            </h1>

            <p className="mt-2 text-gray-500">
                {job.title} — {job.company}
            </p>

            <p className="my-6 font-medium">
                Total Applications: {applications.length}
            </p>

            {error && (
                <p className="mb-4 text-red-500">{error}</p>
            )}

            {applications.length === 0 ? (
                <div className="rounded-xl border p-8">
                    No applications received yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5"
                        >
                            <div>
                                <h2 className="text-lg font-bold">
                                    {app.candidate_name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {app.candidate_email}
                                </p>

                                <p className="mt-2 text-sm">
                                    Applied:{" "}
                                    {new Date(
                                        app.appliedAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor={`status-${app.id}`}
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Application Status
                                </label>

                                <select
                                    id={`status-${app.id}`}
                                    value={app.status}
                                    onChange={(event) =>
                                        handleStatusChange(
                                            app.id,
                                            event.target.value
                                        )
                                    }
                                    className="rounded-md border bg-background px-4 py-2"
                                >
                                    {APPLICATION_STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
