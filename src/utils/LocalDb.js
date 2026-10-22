
const safeRead = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return fallback;
  }
};

export const getDb = (key) => safeRead(key, []);

export const saveDb = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    return false;
  }
};

// Custom authentication helpers.
// These are for your current AuthContext only, not Clerk authentication.
// export const registerUser = (user) => { const users = getDb("jp_users");
// const email = user.email?.trim().toLowerCase();

//   if (users.some((u) => u.email?.toLowerCase() === email)) {
//     throw new Error("Email already registered. Please login.");
//   }

//   const newUser = { ...user, email };
//   users.push(newUser);
//   saveDb("jp_users", users);
//   return newUser;
// };

// export const loginUser = (email, password) => {
//   const normalizedEmail = email.trim().toLowerCase();
//   const users = getDb("jp_users");

//   const user = users.find((u) => u.email?.toLowerCase() === normalizedEmail && u.password === password);

//   if (!user) throw new Error("Invalid email or password.");
//   localStorage.setItem("jp_current_user", JSON.stringify(user));
//   return user;
// };

// export const logoutUser = () => {
//   localStorage.removeItem("jp_current_user");
// };

//export const getCurrentUser = () => safeRead("jp_current_user", null);

// Recruiter-posted jobs
export const getJobs = () => getDb("jp_jobs");

export const saveJobPost = (job) => {
  const jobs = getJobs();
  const index = jobs.findIndex((item) => String(item.id) === String(job.id));

  if (index >= 0) { 
    jobs[index] = job;
  } else {
    jobs.push(job);
  }

  return saveDb("jp_jobs", jobs);
};

export const deleteJobPost = (jobId) => {
  return saveDb(
    "jp_jobs",
    getJobs().filter((job) => String(job.id) !== String(jobId))
  );
};

// Favorites are stored separately from job records.
export const getSavedJobIds = (userId) => userId ? getDb(`jp_saved_${userId}`) : [];

export const toggleSavedJob = (userId, jobId) => {
  if (!userId) return false;

  const key = `jp_saved_${userId}`;
  const ids = getDb(key).map(String);
  const id = String(jobId);
  const isSaved = ids.includes(id);

  const updated = isSaved ? ids.filter((savedId) => savedId !== id) : [...ids, id];
  saveDb(key, updated);
  return !isSaved;
};

// Candidate applications are also separate from saved jobs.
export const getApplications = (userId) => userId ? getDb(`jp_applications_${userId}`) : [];

export const applyToJob = (userId, jobId) => {
  if (!userId) return false;

  const key = `jp_applications_${userId}`;
  const applications = getDb(key);
  const alreadyApplied = applications.some(
    (item) => String(item.jobId) === String(jobId)
  );

  if (alreadyApplied) return false;

  applications.push({ jobId: String(jobId), appliedAt: new Date().toISOString()});
  saveDb(key, applications);
  return true;
};
