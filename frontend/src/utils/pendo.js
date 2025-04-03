export function initializePendo(user: { id: string; email?: string; name?: string; accountId?: string }) {
    if (!window.pendo || typeof window.pendo.initialize !== "function") {
        console.error("Pendo is not loaded yet!");
        return;
    }

    // Avoid re-initialization if Pendo is already running
    if (window.pendo.isReady && window.pendo.isReady()) {
        console.log("Pendo is already initialized.");
        return;
    }

    window.pendo.initialize({
        visitor: {
            id: user.id || "anonymous", // Fallback to avoid empty ID
            email: user.email || "",
            full_name: user.name || "",
        },
        account: {
            id: user.accountId || "unknown_account",
        }
    });

    console.log("Pendo initialized successfully");
}
