
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import AppLayout from "./layouts/app-layout";

import Auth from "./Pages/Auth";
import JobApplicants from "./Pages/job-applicants";
import JobPage from "./Pages/job";
import JobListing from "./Pages/jobListing";
import LandingPage from "./Pages/landing";
import MyApplications from "./Pages/my-applications";
import MyJobs from "./Pages/my-jobs";
import Onboarding from "./Pages/Onboarding";
import PostJob from "./Pages/post-job";
import SavedJobs from "./Pages/saved-jobs";

import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/onboarding",
        element: <Onboarding />,
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
        ),
      },
      {
        path: "/candidate-dashboard",
        element: (
          <ProtectedRoute allowedRole="candidate">
            <Navigate to="/jobs" replace />
          </ProtectedRoute>
        ),
      },
      {
        path: "/recruiter-dashboard",
        element: (
          <ProtectedRoute allowedRole="recruiter">
            <Navigate to="/my-jobs" replace />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute allowedRole="candidate">
            <SavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-applications",
        element: (
          <ProtectedRoute allowedRole="candidate">
            <MyApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute allowedRole="recruiter">
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute allowedRole="recruiter">
            <MyJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id/applicants",
        element: (
          <ProtectedRoute allowedRole="recruiter">
            <JobApplicants />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
