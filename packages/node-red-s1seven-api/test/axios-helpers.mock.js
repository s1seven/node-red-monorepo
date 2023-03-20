const { default: axios, isAxiosError } = require('axios');

const baseURL = 'https://api.s1seven.ovh';

const mockAxiosResponse = {
  data: {},
  headers: {},
};

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'x-version': 1,
  },
  responseType: 'json',
});
axiosInstance.post = jest.fn().mockResolvedValue(mockAxiosResponse);
axiosInstance.get = jest.fn().mockResolvedValue(mockAxiosResponse);
axiosInstance.patch = jest.fn().mockResolvedValue(mockAxiosResponse);
axiosInstance.put = jest.fn().mockResolvedValue(mockAxiosResponse);
axiosInstance.delete = jest.fn().mockResolvedValue(mockAxiosResponse);
axiosInstance.options = jest.fn().mockResolvedValue(mockAxiosResponse);
axiosInstance.head = jest.fn().mockResolvedValue(mockAxiosResponse);

const requestHandler = async (request, send) => {
  const newMsg = {};
  try {
    const response = await request;
    newMsg.headers = response.headers || {};
    newMsg.payload = response.data;
    send([newMsg, null]);
    return { success: true, data: response.data };
  } catch (error) {
    const ex = isAxiosError(error) ? error.response?.data : error;
    const headers = isAxiosError(error) ? error.response?.headers : {};
    newMsg.payload = ex;
    newMsg.headers = headers;
    send([null, newMsg]);
    return { success: false, data: ex };
  }
};

module.exports = {
  axiosInstance,
  baseURL,
  createAxiosInstance: () => axiosInstance,
  requestHandler,
};
