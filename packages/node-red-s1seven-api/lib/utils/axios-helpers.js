/// <reference path="typedefs.js" />

const axios = require('axios');
const { isAxiosError, AxiosResponse } = require('axios');
const { hostname } = require('node:os');

const { version: pkgVersion } = require('../../package.json');

/**
 * @typedef {object} Response
 * @property {boolean} success
 * @property {object | Error} data
 */

/**
 * @typedef {object} AxiosHelpersConstructor
 * @property {import('./async-local-storage')} asyncLocalStorage
 * @property {import('./getters')} getters
 */

class AxiosHelpers {
  /**
   * @param {AxiosHelpersConstructor} container
   * @constructor
   */
  constructor(container) {
    /** @type {AxiosHelpersConstructor['asyncLocalStorage']} */
    this.asyncLocalStorage = container.asyncLocalStorage;
    /** @type {AxiosHelpersConstructor['getters']} */
    this.getters = container.getters;
  }

  /**
   * @returns {import('axios').AxiosInstance}
   */
  createAxiosInstance() {
    const globalContext = this.asyncLocalStorage.getGlobalContext();
    const apiVersion = this.getters.getApiVersion();
    const accessToken = this.getters.getAccessToken(globalContext);
    const companyId = this.getters.getCurrentCompanyId(globalContext);
    const baseURL = this.getters.getApiUrl();
    return axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(companyId ? { company: companyId } : {}),
        'x-version': `${apiVersion}`,
        'user-agent': `node-red-s1seven-api/${pkgVersion}/${hostname}`,
      },
      validateStatus: (status) => status >= 200 && status < 300,
      responseType: 'json',
    });
  }

  /**
   * requestHandler - handles the axios request promise and sends the response to the node
   * @param {Promise<AxiosResponse>} request
   * @param {Send} send
   * @resolves {Response}
   */
  async requestHandler(request, send) {
    const newMsg = { ...this.asyncLocalStorage.getMsg() };
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
  }
}

module.exports = AxiosHelpers;
