import api from './api.js';

const createCrudService = (baseEndpoint) => {
  return {
    getAll: (params = {}) => api.get(baseEndpoint, { params }).then(res => res.data),
    getById: (id) => api.get(`${baseEndpoint}/${id}`).then(res => res.data),
    create: (data) => api.post(baseEndpoint, data).then(res => res.data),
    update: (id, data) => api.put(`${baseEndpoint}/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`${baseEndpoint}/${id}`).then(res => res.data),
  };
};

const createAdminCrudService = (baseEndpoint) => {
  return {
    getAll: (params = {}) => api.get(`/admin${baseEndpoint}`, { params }).then(res => res.data),
    getById: (id) => api.get(`/admin${baseEndpoint}/${id}`).then(res => res.data),
    create: (data) => api.post(`/admin${baseEndpoint}`, data).then(res => res.data),
    update: (id, data) => api.put(`/admin${baseEndpoint}/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/admin${baseEndpoint}/${id}`).then(res => res.data),
  };
};

export { createCrudService, createAdminCrudService };