
import { createContext, useContext, useMemo } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const {
        isLoaded,
        isSignedIn,
        user: clerkUser,
    } = useUser();

    const { signOut } = useClerk();

    const user = useMemo(() => {
        if (!isLoaded || !isSignedIn || !clerkUser) {
            return null;
        }

        const storedRole = clerkUser.unsafeMetadata?.role;

        const role =
            storedRole === "candidate" ||
                storedRole === "recruiter"
                ? storedRole
                : null;

        return {
            id: clerkUser.id,
            name:
                clerkUser.fullName ||
                clerkUser.firstName ||
                clerkUser.primaryEmailAddress?.emailAddress ||
                "User",
            email:
                clerkUser.primaryEmailAddress?.emailAddress || "",
            role,
        };
    }, [isLoaded, isSignedIn, clerkUser]);

    const logout = async () => {
        await signOut({ redirectUrl: "/" });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: !isLoaded,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("AuthProvider is missing");
    }

    return context;
}
