
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import JobCard from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { getJobs } from "@/utils/localDb";
import initialJobs from "@/Data/jobs.json";

const JobListing = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // Combine sample jobs and recruiter-posted jobs
  const jobs = useMemo(() => {
    const postedJobs = getJobs();

    const sampleIds = new Set(initialJobs.map((job) => String(job.id)));

    const duplicates = postedJobs.filter((job) =>
      sampleIds.has(String(job.id))
    );

    console.log("Duplicate job IDs:", duplicates);
    const jobMap = new Map();

    console.log("JSON jobs count:", initialJobs.length);
    console.table(
      initialJobs.map((job) => ({
        id: job.id,
        title: job.title,
      }))
    );

    console.log("Recruiter jobs count:", postedJobs.length);

    // Load all sample jobs
    initialJobs.forEach((job) => {
      jobMap.set(String(job.id), job);
    });

    // Add recruiter jobs
    postedJobs.forEach((job) => {
      jobMap.set(String(job.id), job);
    });

    return Array.from(jobMap.values());
  }, []);

  // Get unique job locations
  const locations = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => job.location)
          .filter(Boolean)
      ),
    ].sort();
  }, [jobs]);

  // Search and filter jobs
  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.description,
        job.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesLocation =
        !location || job.location === location;

      return matchesSearch && matchesLocation;
    });
  }, [jobs, search, location]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
  };

  return (
    <section className="mx-auto max-w-7xl">
      {/* Page Heading */}
      <div className="mb-8 text-center">
        <p className="mb-3 font-semibold text-blue-600">
          FIND YOUR NEXT OPPORTUNITY
        </p>

        <h1 className="gradient-title pb-3 text-4xl font-extrabold sm:text-6xl">
          Explore Jobs
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Discover opportunities that match your skills and goals.
        </p>
      </div>

      {/* Search and Location Filters */}
      <div className="mb-8 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search jobs, companies, skills..."
            className="pl-10 bg-white text-gray-900 placeholder:text-gray-500
             dark:bg-gray-800 dark:text-white
             dark:placeholder:text-gray-400
             dark:border-gray-700"
          />
        </div>

        <select
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Filter by location"
        >
          <option value="">All Locations</option>

          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
        >
          <X size={16} className="mr-2" />
          Clear
        </Button>
      </div>

      {/* Job Count */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Available Opportunities
        </h2>

        <span className="text-sm text-gray-500">
          {filteredJobs.length} jobs found
        </span>
      </div>

      {/* Job Cards */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <h3 className="text-xl font-semibold">
            No Jobs Found
          </h3>

          <p className="mt-2 text-gray-500">
            Try another keyword or clear your filters.
          </p>

          <Button
            className="mt-4"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </section>
  );
};

export default JobListing;
