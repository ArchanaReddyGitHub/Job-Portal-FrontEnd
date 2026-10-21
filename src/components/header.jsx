
import { Link, NavLink } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
} from "@clerk/clerk-react";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

const Header = () => {
  const { user, loading } = useAuth();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const navClass = ({ isActive }) =>
    [
      "inline-flex items-center justify-center",
      "rounded-lg px-4 py-2 text-sm font-semibold",
      "transition-all duration-200",
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        {/* Portal Logo */}
        <Link
          to="/"
          className="inline-flex items-center text-2xl font-extrabold tracking-tight sm:text-3xl"
        >
          <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-transparent dark:from-cyan-300 dark:via-violet-300 dark:to-pink-300">
            SriyanHirrd
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setIsDark((value) => !value)}
            className="rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!loading && (
            <>
              <SignedOut>
                <Link to="/auth">
                  <Button variant="blue">
                    Login / Sign Up
                  </Button>
                </Link>
              </SignedOut>

              <SignedIn>
                <nav className="flex flex-wrap items-center gap-2">
                  {user?.role === "candidate" ? (
                    <>
                      <NavLink
                        to="/jobs"
                        end
                        className={navClass}
                      >
                        Jobs
                      </NavLink>

                      <NavLink
                        to="/saved-jobs"
                        className={navClass}
                      >
                        Saved
                      </NavLink>

                      <NavLink
                        to="/my-applications"
                        className={navClass}
                      >
                        Applications
                      </NavLink>
                    </>
                  ) : user?.role === "recruiter" ? (
                    <>
                      <NavLink
                        to="/jobs"
                        end
                        className={navClass}
                      >
                        Jobs
                      </NavLink>

                      <NavLink
                        to="/post-job"
                        className={navClass}
                      >
                        Post a Job
                      </NavLink>

                      <NavLink
                        to="/my-jobs"
                        className={navClass}
                      >
                        My Jobs
                      </NavLink>
                    </>
                  ) : null}

                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10",
                      },
                    }}
                  />

                  <SignOutButton redirectUrl="/">
                    <button
                      type="button"
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      Logout
                    </button>
                  </SignOutButton>
                </nav>
              </SignedIn>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
