import api from './api';
export const getStreak = () => api.get('/daily-streak');
export const claimStreak = () => api.post('/daily-streak/claim');
export const getHistory = () => api.get('/daily-streak/history');
export const getWallet = () => api.get('/wallet');
