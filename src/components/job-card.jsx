
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, MapPinIcon, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { getSavedJobIds, toggleSavedJob } from "../utils/LocalDb";
import { useAuth } from "../context/AuthContext";

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(
      getSavedJobIds(user?.id).some(
        (id) => String(id) === String(job.id)
      )
    );
  }, [user?.id, job.id]);

  const handleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user || user.role !== "candidate") return;

    const newSavedState = toggleSavedJob(user.id, job.id);
    setSaved(newSavedState);
  };

  return (
    <article className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-start justify-between gap-3 pr-8">
        <div className="flex items-center gap-3">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company || "Company"} logo`}
              className="h-12 w-12 rounded-lg border border-gray-200 bg-white object-contain p-1 dark:border-gray-700"
              loading="lazy"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Building2 size={22} />
            </div>
          )}

          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              {job.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {job.company || "Company"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {job.type || "Full-time"}
        </span>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
          {job.isOpen === false ? "Closed" : "Open"}
        </span>
      </div>

      <p className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <MapPinIcon size={16} />
        {job.location || "Location not specified"}
      </p>

      <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {job.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <Link
          to={`/job/${encodeURIComponent(String(job.id))}`}
          className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View Details →
        </Link>

        {user?.role === "candidate" && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={saved ? "Remove saved job" : "Save job"}
            aria-pressed={saved}
            onClick={handleSave}
          >
            <Bookmark
              size={20}
              fill={saved ? "currentColor" : "none"}
              className={saved ? "text-blue-600" : "text-gray-500"}
            />
          </Button>
        )}
      </div>
    </article>
  );
};

export default JobCard;
