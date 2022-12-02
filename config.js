const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;

export const API = {
  POST_LIST: `${BASE_URL}/posts`,
  CREATE_POST: `${BASE_URL}/posts`,
  POST_DETAIL: `${BASE_URL}/posts`,
  UPDATE_POST: `${BASE_URL}/posts`,
  DELETE_POST: `${BASE_URL}/posts`,
};
