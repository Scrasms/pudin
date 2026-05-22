import { BACKEND_HOST, BACKEND_PORT } from '../../backend.config.json';

interface FetchObj {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

/**
 * Makes a Fetch api call to the given path, using the given method and with the provided body and token
 * @param path  - path of backend route
 * @param method - request's HTTP method
 * @param body - request's body
 * @param queryObj - object representing the query string of request
 * @param token - request's token
 * @returns promise resolving to response parsed as json or an error
 */
const apiCall = async (
  path: string,
  method: string,
  body?: object | null,
  queryObj?: Record<string | number | symbol, string | number | object>,
  token?: string | null,
) => {
  let fetchURL = `http://${BACKEND_HOST}:${BACKEND_PORT}/${path}`;
  if (queryObj) {
    const queryStr = Object.entries(queryObj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    fetchURL += '?' + queryStr;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchObj: FetchObj = {
    method: method,
    headers: headers,
  };

  if (body) {
    fetchObj.body = JSON.stringify(body);
  }

  const response = await fetch(fetchURL, fetchObj);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
};

export { apiCall };
