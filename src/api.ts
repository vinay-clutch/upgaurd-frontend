import { API_BASE_URL } from './config';

const request = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem('token');
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: (options.credentials as RequestCredentials) || 'include',
    body: options.body,
  };
  
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("Fetching:", url);
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

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

const signup = (username: any, password: any, email: any) =>
  request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  });

const signin = (username: any, password: any) =>
  request('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

const initiateGoogleAuth = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

const getWebsites = () => request('/websites');
const me = () => request('/auth/me');

const updateEmail = (email: any) =>
  request('/websites/user/email', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  });

const createWebsite = (url: any) =>
  request('/websites', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });

const getWebsiteStatus = (websiteId: any) => request(`/websites/${websiteId}/status`);

const pauseWebsite = (websiteId: any) =>
  request(`/websites/${websiteId}/pause`, { method: 'POST' });

const resumeWebsite = (websiteId: any) =>
  request(`/websites/${websiteId}/resume`, { method: 'POST' });

const deleteWebsite = (websiteId: any) =>
  request(`/websites/${websiteId}`, { method: 'DELETE' });

const getIncidentHistory = (websiteId: any) =>
  request(`/websites/${websiteId}/incidents`);

const getSslStatus = (websiteId: any) =>
  request(`/websites/${websiteId}/ssl`);

const getPublicStatus = (websiteId: any) =>
  request(`/websites/public/${websiteId}`);

const updateDiscordWebhook = (webhookUrl: any) =>
  request('/websites/user/discord', {
    method: 'PUT',
    body: JSON.stringify({ webhook_url: webhookUrl }),
  });

const removeDiscordWebhook = () =>
  request('/websites/user/discord', {
    method: 'DELETE',
  });

const enableAnalytics = (websiteId: any) =>
  request(`/analytics/${websiteId}/enable`, { method: 'POST' });

const getAnalytics = (websiteId: any) =>
  request(`/analytics/${websiteId}`);

const resolveError = (errorId: any) =>
  request(`/analytics/errors/${errorId}/resolve`, { method: 'PATCH' });

const downloadPdfReport = async (websiteId: any) => {
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

const updateSlackWebhook = (webhookUrl: any) =>
  request('/websites/user/slack', {
    method: 'PUT',
    body: JSON.stringify({ webhook_url: webhookUrl })
  });

const removeSlackWebhook = () =>
  request('/websites/user/slack', { method: 'DELETE' });

const updateWebsiteTags = (websiteId: any, tags: any) =>
  request(`/websites/${websiteId}/tags`, {
    method: 'PUT',
    body: JSON.stringify({ tags })
  });

const getSecurityHeaders = (websiteId: any) =>
  request(`/websites/${websiteId}/security`);

const updateCheckInterval = (websiteId: any, interval: any) =>
  request(`/websites/${websiteId}/interval`, {
    method: 'PUT',
    body: JSON.stringify({ interval })
  });

const setMaintenance = (websiteId: any, start: any, end: any, note: any) =>
  request(`/websites/${websiteId}/maintenance`, {
    method: 'PUT',
    body: JSON.stringify({ start, end, note })
  });

const clearMaintenance = (websiteId: any) =>
  request(`/websites/${websiteId}/maintenance`, {
    method: 'DELETE'
  });

const exportCsv = async (websiteId: any, days: number = 30) => {
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

const updateProfile = (name: any, email: any) =>
  request('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify({ name, email }),
  });

const changePassword = (currentPassword: any, newPassword: any) =>
  request('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

const deleteAccount = () =>
  request('/auth/delete-account', {
    method: 'DELETE',
  });

const getRemediation = (errorCode: any) =>
  request(`/websites/remediation/suggest?error_code=${errorCode}`);

const getDashboardStats = () => request('/websites/stats/summary');
const getGlobalPerformance = () => request('/websites/stats/performance');
const getPublicStatusByUsername = (username: any) => request(`/public/${username}`);

const getLiveCount = (websiteId: any) =>
  request(`/analytics/${websiteId}/live-count`);

const getAIMLStats = () => request('/websites/aiml/stats');

export const api = {

  request,
  signup,
  signin,
  initiateGoogleAuth, 
  getWebsites,
  createWebsite,
  getWebsiteStatus,
  getDashboardStats,
  getGlobalPerformance,
  getRemediation,
  getPublicStatusByUsername,
  me,
  updateEmail,
  updateProfile,
  changePassword,
  deleteAccount,
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
  getLiveCount,
  getAIMLStats,
};

