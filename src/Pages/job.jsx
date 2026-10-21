
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  ArrowLeft,
  DoorOpen,
  DoorClosed,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

import { Button } from "@/components/ui/button";
import { getJobs, deleteJobPost } from "@/utils/localDb";
import {
  applyForJob,
  getCandidateApplications,
} from "@/utils/applicationStore";
import initialJobs from "@/Data/jobs.json";
import { useAuth } from "@/context/AuthContext";

const JobPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);

  // Find the job from JSON data and Local Storage
  const job = useMemo(() => {
    const postedJobs = getJobs();
    const byId = new Map();

    [...initialJobs, ...postedJobs].forEach((item) => {
      byId.set(String(item.id), item);
    });

    return byId.get(String(id));
  }, [id]);

  // Check whether the candidate already applied
  const alreadyApplied =
    applied ||
    (user?.role === "candidate" &&
      getCandidateApplications(user.id).some(
        (app) => String(app.job_id) === String(id)
      ));

  // Candidate applies for a job
  const handleApply = () => {
    if (!job || !user || user.role !== "candidate") {
      return;
    }

    setMessage("");

    try {
      applyForJob(job, user);
      setApplied(true);
      setMessage("Application submitted successfully!");
    } catch (error) {
      setMessage(error.message || "Unable to apply for this job.");
    }
  };

  // Recruiter deletes their own job
  const handleDelete = () => {
    if (
      !job ||
      user?.role !== "recruiter" ||
      String(job.recruiter_id) !== String(user.id)
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    deleteJobPost(job.id);
    navigate("/my-jobs");
  };

  // Job not found
  if (!job) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="text-2xl font-bold">
          Job not found
        </h1>

        <p className="mt-2 text-gray-500">
          This job may have been removed or the link is invalid.
        </p>

        <Button asChild className="mt-5">
          <Link to="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  const isRecruiterOwner =
    user?.role === "recruiter" &&
    String(job.recruiter_id) === String(user.id);

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Back to jobs */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      {/* Job header */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {job.companyLogo && (
              <img
                src={job.companyLogo}
                alt={`${job.company || "Company"} logo`}
                className="h-14 w-14 rounded-xl border bg-white object-contain p-2"
              />
            )}

            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                {job.title}
              </h1>

              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {job.company || "Company"}
              </p>
            </div>
          </div>

          {/* Recruiter delete button */}
          {isRecruiterOwner && (
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Job
            </Button>
          )}
        </div>

        {/* Job information */}
        <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <MapPin size={17} />
            {job.location || "Location not specified"}
          </span>

          <span className="flex items-center gap-2">
            <Briefcase size={17} />
            {job.type || "Full-time"}
          </span>

          <span className="flex items-center gap-2">
            {job.isOpen === false ? (
              <DoorClosed
                size={17}
                className="text-red-500"
              />
            ) : (
              <DoorOpen
                size={17}
                className="text-green-500"
              />
            )}

            {job.isOpen === false ? "Closed" : "Open"}
          </span>
        </div>

        {/* Candidate Apply Button */}
        {user?.role === "candidate" && (
          <div className="mt-6 border-t pt-6 dark:border-gray-800">
            <Button
              type="button"
              disabled={
                job.isOpen === false ||
                alreadyApplied
              }
              onClick={handleApply}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {job.isOpen === false
                ? "Job Closed"
                : alreadyApplied
                  ? "Already Applied"
                  : "Apply for Job"}
            </Button>

            {message && (
              <p
                role="status"
                className="mt-3 text-sm text-blue-600"
              >
                {message}
              </p>
            )}
          </div>
        )}

        {/* Recruiter applicants button */}
        {isRecruiterOwner && (
          <div className="mt-6 border-t pt-6 dark:border-gray-800">
            <Button asChild>
              <Link to={`/job/${job.id}/applicants`}>
                View Applicants
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* Job description */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h2 className="mb-4 text-2xl font-bold">
          About This Role
        </h2>

        <div className="max-h-[450px] overflow-y-auto whitespace-pre-wrap break-words pr-3 text-base leading-8 text-gray-700 dark:text-gray-300">
          {job.description || "No description provided."}
        </div>
      </section>

      {/* Requirements */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <h2 className="mb-4 text-2xl font-bold">
          Requirements
        </h2>

        <div
          className="max-h-[400px] overflow-y-auto overflow-x-auto rounded-xl bg-gray-50 p-4 dark:bg-gray-950"
          data-color-mode="auto"
        >
          <MDEditor.Markdown
            source={
              job.requirements ||
              "No requirements provided."
            }
            style={{
              backgroundColor: "transparent",
              color: "inherit",
              whiteSpace: "pre-wrap",
            }}
          />
        </div>
      </section>
    </main>
  );
};

export default JobPage;
