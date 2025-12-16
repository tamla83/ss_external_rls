import { embedDashboard } from "@superset-ui/embedded-sdk";
import { useEffect, useState } from "react";

const SUPERSET_URL = import.meta.env.VITE_SUPERSET_URL;
const DASHBOARD_ID = import.meta.env.VITE_DASHBOARD_ID;
const SUPERSET_USERNAME = import.meta.env.VITE_SUPERSET_USERNAME;
const SUPERSET_PASSWORD = import.meta.env.VITE_SUPERSET_PASSWORD;

// Helper constants
const SUPERSET_API_URL = `${SUPERSET_URL}/api/v1/security`;
const SUPERSET_CONTAINER_ID = "superset-container";

async function fetchSupersetGuestToken(
  dashboardId: string,
  username: string,
  password: string
) {
  try {
    // --- Step 1: Get Access Token (Login) ---
    const loginResponse = await fetch(`${SUPERSET_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        provider: "db",
        refresh: true,
        username: username,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed with status: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const accessToken = loginData["access_token"];
    console.log("Successfully retrieved Superset Access Token.");

    // --- Step 2: Get Guest Token ---
    const guestTokenBody = {
      resources: [{ type: "dashboard", id: dashboardId }],
      rls: [],
      user: {
        username: "report-viewer",
        first_name: "report-viewer",
        last_name: "report-viewer",
      },
    };

    const guestTokenResponse = await fetch(`${SUPERSET_API_URL}/guest_token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(guestTokenBody),
    });

    if (!guestTokenResponse.ok) {
      throw new Error(
        `Guest Token generation failed with status: ${guestTokenResponse.status}`
      );
    }

    const guestTokenData = await guestTokenResponse.json();
    const guestToken = guestTokenData["token"];
    console.log("Successfully retrieved Superset Guest Token.");

    return guestToken;
  } catch (error) {
    console.error("Error fetching Superset token:", error);
    // Throwing the error ensures the component knows the embed failed
    throw error;
  }
}

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mountPoint = document.getElementById(SUPERSET_CONTAINER_ID);

    // Guard against running if the mount point isn't ready
    if (!mountPoint) {
      console.error(`Mount point #${SUPERSET_CONTAINER_ID} not found.`);
      setError("Embedding container not found.");
      setIsLoading(false);
      return;
    }

    const runEmbed = async () => {
      try {
        // The fetchGuestToken must be a function that returns a Promise resolving to the token.
        const fetchGuestTokenCallback = async () => {
          return await fetchSupersetGuestToken(
            DASHBOARD_ID,
            SUPERSET_USERNAME,
            SUPERSET_PASSWORD
          );
        };

        // Use the embedded-sdk function
        embedDashboard({
          id: DASHBOARD_ID,
          supersetDomain: SUPERSET_URL,
          mountPoint: mountPoint,
          fetchGuestToken: fetchGuestTokenCallback,
          dashboardUiConfig: {
            hideTitle: false,            
            filters: {
              visible: true,
              expanded: true,
            },
          },
          // You can add event handlers here (e.g., onDashboardLoaded)
          iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
        });

        const iframe = mountPoint.querySelector("iframe");
        if (iframe) {
            iframe.style.width = "100%";
            iframe.style.minHeight = "100vh";
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load Superset dashboard due to API error.");
        setIsLoading(false);
      }
    };

    runEmbed();
  }, []); // Run only once on component mount

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Superset Dashboard Viewer
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Embedding Dashboard ID:{" "}
          <code className="bg-gray-200 p-1 rounded text-sm">
            {DASHBOARD_ID}
          </code>
        </p>
      </header>

      <main className="w-full max-w-7xl mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-lg">
            <svg
              className="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-lg text-gray-600">
              Loading Dashboard and Fetching Tokens...
            </span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <p className="text-sm mt-1">
              Check your network connection, API URLs, and Superset credentials.
            </p>
          </div>
        )}

        {/* This is the mount point for the Superset iframe */}
        <div
          id={SUPERSET_CONTAINER_ID}
          className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* The content will be replaced by the Superset iFrame */}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
