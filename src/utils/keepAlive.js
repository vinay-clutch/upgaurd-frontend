export function startKeepAlive() {
  const BACKEND_URL = import.meta.env.VITE_API_URL || 
    'https://upgaurd-backend-production.up.railway.app';
  
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/health`);
      console.log('keepAlive ping sent');
    } catch (e) {}
  }, 4 * 60 * 1000);
}
