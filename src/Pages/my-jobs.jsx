
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getJobs } from "../utils/LocalDb";
import JobCard from "../components/job-card";
import { Button } from "../components/ui/button";

const MyJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!user?.id) {
      setJobs([]);
      return;
    }

    const loadJobs = () => {
      const allJobs = getJobs();

      const myJobs = allJobs.filter(
        (job) =>
          String(job.recruiter_id) === String(user.id)
      );

      setJobs(myJobs);
    };

    loadJobs();

    window.addEventListener("storage", loadJobs);
    window.addEventListener("focus", loadJobs);

    return () => {
      window.removeEventListener("storage", loadJobs);
      window.removeEventListener("focus", loadJobs);
    };
  }, [user?.id]);

  return (
    <main className="mx-auto max-w-7xl pb-12">
      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="gradient-title pb-2 text-4xl font-extrabold sm:text-6xl">
            My Posted Jobs
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Manage your job postings and applications.
          </p>
        </div>

        <Button asChild>
          <Link to="/post-job">
            <PlusCircle size={18} className="mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Job Count */}
      <p className="mb-6 text-sm text-gray-500">
        Total Posted Jobs: {jobs.length}
      </p>

      {/* Job List */}
      {jobs.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="space-y-3">
              <JobCard job={job} />

              {/* Recruiter Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <Link to={`/job/${job.id}`}>
                    View Job
                  </Link>
                </Button>

                <Button asChild className="flex-1">
                  <Link to={`/job/${job.id}/applicants`}>
                    <Users size={16} className="mr-2" />
                    Applicants
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <h2 className="text-2xl font-semibold">
            No jobs posted yet
          </h2>

          <p className="mt-3 text-gray-500">
            Create your first job posting to start receiving
            applications.
          </p>

          <Button asChild className="mt-6">
            <Link to="/post-job">
              <PlusCircle size={18} className="mr-2" />
              Post Your First Job
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
};

export default MyJobs;
