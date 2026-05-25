import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
    plugins: [magicLinkClient()],
    fetchOptions: {
        credentials: 'include',
    },
});

// Export hooks for easy use
export const {
    signIn,
    signOut,
    signUp,
    useSession,
} = authClient;
