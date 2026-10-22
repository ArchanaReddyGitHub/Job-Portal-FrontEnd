
import { useMemo, useState, useEffect } from "react";
import JobCard from "../components/job-card";
import { useAuth } from "../context/AuthContext";
import { getJobs, getSavedJobIds } from "../utils/LocalDb";
import initialJobs from "../Data/jobs.json";

const SavedJobs = () => {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const handleFocus = () => setRefresh((value) => value + 1);
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const jobs = useMemo(() => {
    const allJobs = new Map();

    [...initialJobs, ...getJobs()].forEach((job) => {
      allJobs.set(String(job.id), job);
    });

    const savedIds = getSavedJobIds(user?.id).map(String);

    return savedIds
      .map((id) => allJobs.get(id))
      .filter(Boolean);
  }, [user?.id, refresh]);

  return (
    <section className="mx-auto max-w-7xl">
      <h1 className="gradient-title pb-6 text-center text-4xl font-extrabold sm:text-6xl">
        Saved Jobs
      </h1>

      <p className="mb-6 text-center text-gray-500">
        Your bookmarked opportunities, all in one place.
      </p>

      {jobs.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <h2 className="text-xl font-semibold">No saved jobs yet</h2>
          <p className="mt-2 text-gray-500">
            Browse jobs and select the bookmark icon to save one.
          </p>
        </div>
      )}
    </section>
  );
};

export default SavedJobs;
