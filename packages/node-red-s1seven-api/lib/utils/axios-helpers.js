/// <reference path="typedefs.js" />

const { default: axios } = require('axios');
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
    const apiVersion = this.getters.getApiVersion();
    const accessToken = this.getters.getAccessToken();
    const companyId = this.getters.getCurrentCompanyId();
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
   * @param {NodeRedSend} send
   * @resolves {Response}
   */
  async requestHandler(request, send) {
    const msg = { ...this.asyncLocalStorage.getMsg() };
    try {
      const response = await request;
      msg.headers = response.headers || {};
      msg.payload = response.data;
      send([msg, null]);
      return { success: true, data: response.data };
    } catch (error) {
      const ex = isAxiosError(error) ? error.response?.data : error;
      const headers = isAxiosError(error) ? error.response?.headers : {};
      msg.payload = ex;
      msg.headers = headers;
      send([null, msg]);
      return { success: false, data: ex };
    }
  }
}

module.exports = AxiosHelpers;
