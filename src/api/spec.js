import http from './http';

export const getRankings = ({ type, jobField, cursor, limit }) => {
  return http.get('/api/specs', {
    params: {
      type,
      jobField,
      cursor,
      limit,
    },
  });
};

export const getSearch = ({
  type,
  'nickname-keyword': keyword,
  cursor,
  limit,
}) => {
  return http.get('/api/specs', {
    params: {
      type,
      'nickname-keyword': keyword,
      cursor,
      limit,
    },
  });
};

export const getMetaData = ({ type, jobField }) => {
  return http.get('/api/specs', {
    params: {
      type,
      jobField,
    },
  });
};

export const getSpecDetail = (specId) => {
  return http.get(`/api/specs/${specId}`);
};

export const createSpec = (data) => {
  return http.post('/api/specs', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateSpec = (specId, data) => {
  return http.put(`/api/specs/${specId}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const analyzeResume = (resumeFile) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  
  return http.post('/api/resume/analysis', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
