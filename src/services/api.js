export const API_BASE_URL = import.meta.env.VITE_API_URL;

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: 'include', // Ensure cookies are sent (for sessions)
    ...options,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    let data;
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }
    
    if (!response.ok) {
      const message = data?.message || 'Request failed';
      throw new Error(message);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

const signup = (username, password, email) =>
  request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  });

const signin = (username, password) =>
  request('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

const initiateGoogleAuth = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

const getWebsites = () => request('/websites');
const me = () => request('/auth/me');

const updateEmail = (email) =>
  request('/websites/user/email', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  });

const createWebsite = (url) =>
  request('/websites', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });

const getWebsiteStatus = (websiteId) => request(`/websites/${websiteId}/status`);

const pauseWebsite = (websiteId) =>
  request(`/websites/${websiteId}/pause`, { method: 'POST' });

const resumeWebsite = (websiteId) =>
  request(`/websites/${websiteId}/resume`, { method: 'POST' });

const deleteWebsite = (websiteId) =>
  request(`/websites/${websiteId}`, { method: 'DELETE' });

const getIncidentHistory = (websiteId) =>
  request(`/websites/${websiteId}/incidents`);

const getSslStatus = (websiteId) =>
  request(`/websites/${websiteId}/ssl`);

const getPublicStatus = (websiteId) =>
  request(`/websites/public/${websiteId}`);

const updateDiscordWebhook = (webhookUrl) =>
  request('/websites/user/discord', {
    method: 'PUT',
    body: JSON.stringify({ webhook_url: webhookUrl }),
  });

const removeDiscordWebhook = () =>
  request('/websites/user/discord', {
    method: 'DELETE',
  });

const enableAnalytics = (websiteId) =>
  request(`/analytics/${websiteId}/enable`, { method: 'POST' });

const getAnalytics = (websiteId) =>
  request(`/analytics/${websiteId}`);

const resolveError = (errorId) =>
  request(`/analytics/errors/${errorId}/resolve`, { method: 'PATCH' });

const downloadPdfReport = async (websiteId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${API_BASE_URL}/websites/${websiteId}/report/pdf`,
    { 
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    }
  );
  const html = await response.text();
  const newTab = window.open();
  if (newTab) {
    newTab.document.write(html);
    newTab.document.close();
  }
};

const updateSlackWebhook = (webhookUrl) =>
  request('/websites/user/slack', {
    method: 'PUT',
    body: JSON.stringify({ webhook_url: webhookUrl })
  });

const removeSlackWebhook = () =>
  request('/websites/user/slack', { method: 'DELETE' });

const updateWebsiteTags = (websiteId, tags) =>
  request(`/websites/${websiteId}/tags`, {
    method: 'PUT',
    body: JSON.stringify({ tags })
  });

const getSecurityHeaders = (websiteId) =>
  request(`/websites/${websiteId}/security`);

const updateCheckInterval = (websiteId, interval) =>
  request(`/websites/${websiteId}/interval`, {
    method: 'PUT',
    body: JSON.stringify({ interval })
  });

const setMaintenance = (websiteId, start, end, note) =>
  request(`/websites/${websiteId}/maintenance`, {
    method: 'PUT',
    body: JSON.stringify({ start, end, note })
  });

const clearMaintenance = (websiteId) =>
  request(`/websites/${websiteId}/maintenance`, {
    method: 'DELETE'
  });

const exportCsv = async (websiteId, days = 30) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${API_BASE_URL}/websites/${websiteId}/export/csv?days=${days}`,
    { 
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    }
  );
  if (!response.ok) throw new Error('Export failed');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `antigravtiven-report-${days}days.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const api = {
  request,
  signup,
  signin,
  initiateGoogleAuth, 
  getWebsites,
  createWebsite,
  getWebsiteStatus,
  me,
  updateEmail,
  pauseWebsite,
  resumeWebsite,
  deleteWebsite,
  getIncidentHistory,
  getSslStatus,
  getPublicStatus,
  updateDiscordWebhook,
  removeDiscordWebhook,
  enableAnalytics,
  getAnalytics,
  resolveError,
  downloadPdfReport,
  updateSlackWebhook,
  removeSlackWebhook,
  updateWebsiteTags,
  getSecurityHeaders,
  updateCheckInterval,
  setMaintenance,
  clearMaintenance,
  exportCsv,
};
