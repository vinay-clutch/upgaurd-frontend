// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("VITE_API_URL not set! Using default...");
}

export const API_BASE_URL = API_URL || "http://localhost:8080/api";
export const SOCKET_URL = "http://localhost:8080";

console.log("API_BASE_URL:", API_BASE_URL);
console.log("SOCKET_URL:", SOCKET_URL);
