export function startKeepAlive() {
  const BACKEND_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:8080';
  
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/health`);
      console.log('keepAlive ping sent');
    } catch (e) {}
  }, 4 * 60 * 1000);
}
