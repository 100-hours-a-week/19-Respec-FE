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

export const createSpec = (formData) => {
  return http.post('/api/specs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateSpec = (specId, formData) => {
  return http.put(`/api/specs/${specId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
