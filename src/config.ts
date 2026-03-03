// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("VITE_API_URL not set! Using default...");
}

export const API_BASE_URL = API_URL || "https://upgaurd-backend-production.up.railway.app";
export const SOCKET_URL = API_BASE_URL;

console.log("API_BASE_URL:", API_BASE_URL);
console.log("SOCKET_URL:", SOCKET_URL);
