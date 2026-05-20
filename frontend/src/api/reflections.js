import api from './axios';

export const getReflections   = ()           => api.get('/reflections');
export const getReflectionByDate = (date)    => api.get(`/reflections/${date}`);
export const saveReflection   = (data)       => api.post('/reflections', data);
export const updateReflection = (date, data) => api.put(`/reflections/${date}`, data);
export const deleteReflection = (date)       => api.delete(`/reflections/${date}`);