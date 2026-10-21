
const APPLICATION_KEY = "jp_applications";

export const APPLICATION_STATUSES = [
  "Applied",
  "Interview",
  "Selected",
  "Rejected",
];

export function getApplications() {
  try {
    const data = JSON.parse(
      localStorage.getItem(APPLICATION_KEY) || "[]"
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveApplications(applications) {
  localStorage.setItem(
    APPLICATION_KEY,
    JSON.stringify(applications)
  );
  window.dispatchEvent(new Event("applications-updated"));
}

export function applyForJob(job, user) {
  if (!user || user.role !== "candidate") {
    throw new Error("Only candidates can apply.");
  }

  if (job.isOpen === false) {
    throw new Error("This job is closed.");
  }

  const applications = getApplications();

  const alreadyApplied = applications.some(
    (app) =>
      String(app.job_id) === String(job.id) &&
      app.candidate_id === user.id
  );

  if (alreadyApplied) {
    throw new Error("You already applied for this job.");
  }

  const application = {
    id: crypto.randomUUID(),
    job_id: job.id,
    candidate_id: user.id,
    candidate_name: user.name,
    candidate_email: user.email,
    recruiter_id: job.recruiter_id ?? null,
    job_title: job.title,
    company: job.company,
    status: "Applied",
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveApplications([...applications, application]);

  return application;
}

export function getCandidateApplications(candidateId) {
  return getApplications().filter(
    (app) => app.candidate_id === candidateId
  );
}

export function getJobApplications(jobId, recruiterId) {
  return getApplications().filter(
    (app) =>
      String(app.job_id) === String(jobId) &&
      app.recruiter_id === recruiterId
  );
}

export function updateApplicationStatus(
  applicationId,
  recruiterId,
  newStatus
) {
  if (!APPLICATION_STATUSES.includes(newStatus)) {
    throw new Error("Invalid application status.");
  }

  const applications = getApplications();
  const application = applications.find(
    (app) => app.id === applicationId
  );

  if (!application) {
    throw new Error("Application not found.");
  }

  if (
    !application.recruiter_id ||
    application.recruiter_id !== recruiterId
  ) {
    throw new Error("You cannot update this application.");
  }

  const updated = applications.map((app) =>
    app.id === applicationId
      ? {
          ...app,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }
      : app
  );

  saveApplications(updated);
  return updated.find((app) => app.id === applicationId);
}
