/// <reference path="typedefs.js" />

const {
  DEFAULT_API_ENVIRONMENT,
  DEFAULT_API_VERSION,
  URL_TO_ENV_MAP,
  DEFAULT_API_MODE,
} = require('../../resources/constants');
const {
  GLOBAL_ACCESS_TOKEN_KEY,
  GLOBAL_COMPANY_ID_KEY,
  GLOBAL_MODE_KEY,
} = require('./keys');

/**
 * @typedef {object} GettersConstructor
 * @property {import('./async-local-storage')} asyncLocalStorage
 */

class Getters {
  /**
   * @param {GettersConstructor} container
   * @constructor
   */
  constructor(container) {
    /** @type {GettersConstructor['asyncLocalStorage']} */
    this.asyncLocalStorage = container.asyncLocalStorage;
    this.S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;
  }

  _getMsg() {
    return this.asyncLocalStorage.getMsg();
  }

  _getApiConfig() {
    return this.asyncLocalStorage.getApiConfig();
  }

  _getGlobalContext() {
    return this.asyncLocalStorage.getGlobalContext();
  }

  /**
   * @returns {ApiEnvironment} environment
   */
  getApiEnvironment() {
    const msg = this._getMsg();
    const apiConfig = this._getApiConfig();
    return msg.environment || apiConfig?.environment || DEFAULT_API_ENVIRONMENT;
  }

  /**
   * @returns {string} base url
   */
  getApiUrl() {
    const environment = this.getApiEnvironment();
    const BASE_URL = URL_TO_ENV_MAP[environment];
    return `${this.S1SEVEN_BASE_URL || BASE_URL}/api`;
  }

  /**
   * @returns {number} version
   */
  getApiVersion() {
    const apiConfig = this._getApiConfig();
    return apiConfig.apiVersion || DEFAULT_API_VERSION;
  }

  /**
   * @returns {ApiMode} mode
   */
  getApiMode() {
    const msg = this._getMsg();
    const apiConfig = this._getApiConfig();
    const globalContext = this._getGlobalContext();
    return (
      msg.mode ||
      globalContext.get(GLOBAL_MODE_KEY(apiConfig)) ||
      DEFAULT_API_MODE
    );
  }

  /**
   * @returns {string | undefined} access token
   */
  getAccessToken() {
    const msg = this._getMsg();
    const apiConfig = this._getApiConfig();
    const globalContext = this._getGlobalContext();
    return (
      msg.accessToken || globalContext.get(GLOBAL_ACCESS_TOKEN_KEY(apiConfig))
    );
  }

  /**
   * @returns {string | undefined} company id
   */
  getCurrentCompanyId() {
    const msg = this._getMsg();
    const apiConfig = this._getApiConfig();
    const globalContext = this._getGlobalContext();
    return msg.companyId || globalContext.get(GLOBAL_COMPANY_ID_KEY(apiConfig));
  }
}

module.exports = Getters;
