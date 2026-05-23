import api from './axios';

export const getChallenges    = ()              => api.get('/challenges');
export const createChallenge  = (data)          => api.post('/challenges', data);
export const updateChallenge  = (id, data)      => api.put(`/challenges/${id}`, data);
export const deleteChallenge  = (id)            => api.delete(`/challenges/${id}`);
export const getChallengeLogs = (id)            => api.get(`/challenges/${id}/logs`);
export const checkIn          = (id, data)      => api.post(`/challenges/${id}/checkin`, data);
export const getTimetable     = (type)          => api.get(`/timetable/${type}`);
export const addSlot          = (type, data)    => api.post(`/timetable/${type}/slots`, data);
export const removeSlot       = (type, slotId)  => api.delete(`/timetable/${type}/slots/${slotId}`);