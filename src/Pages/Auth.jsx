
import { useState } from "react";
import {
    SignIn,
    SignUp,
    useAuth as useClerkAuth,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function Auth() {
    const [mode, setMode] = useState("signin");
    const { isLoaded, isSignedIn } = useClerkAuth();

    if (!isLoaded) {
        return (
            <div className="py-12 text-center">
                Loading authentication...
            </div>
        );
    }

    if (isSignedIn) {
        return <Navigate to="/jobs" replace />;
    }

    return (
        <section className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center gap-6 px-4 py-8">
            <h1 className="text-center text-3xl font-bold">
                {mode === "signin"
                    ? "Welcome Back"
                    : "Create Your Account"}
            </h1>

            {mode === "signin" ? (
                <SignIn
                    routing="hash"
                    forceRedirectUrl="/jobs"
                />
            ) : (
                <SignUp
                    routing="hash"
                    forceRedirectUrl="/jobs"
                />
            )}

            <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() =>
                    setMode((value) =>
                        value === "signin" ? "signup" : "signin"
                    )
                }
            >
                {mode === "signin"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
            </button>
        </section>
    );
}
