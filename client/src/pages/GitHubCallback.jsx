import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code) {
      // Verify state matches for CSRF protection
      const storedState = sessionStorage.getItem("github_oauth_state");
      if (state === storedState) {
        // Store the authorization code
        sessionStorage.setItem("github_auth_code", code);
        // Clear the state
        sessionStorage.removeItem("github_oauth_state");

        // Try to notify parent window
        if (window.opener) {
          try {
            window.opener.postMessage({ type: "github_auth_complete", code }, window.location.origin);
          } catch (e) {
            console.error("Could not post message to opener:", e);
          }
        }
      }
    }

    // Close the popup after a short delay
    const timeout = setTimeout(() => {
      window.close();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050508]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Authorizing... This window will close automatically.</p>
      </div>
    </div>
  );
}
