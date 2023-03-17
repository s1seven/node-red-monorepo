const {
  GLOBAL_ACCESS_TOKEN_KEY,
  GLOBAL_COMPANY_ID_KEY,
  GLOBAL_MODE_KEY,
} = require('./getters');

/**
 * @typedef {object} SettersConstructor
 * @property {import('./async-local-storage')} asyncLocalStorage
 */

class Setters {
  /**
   * @param {SettersConstructor} container
   * @constructor
   */
  constructor(container) {
    /** @type {SettersConstructor['asyncLocalStorage']} */
    this.asyncLocalStorage = container.asyncLocalStorage;
    this.S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;
  }

  _getMsg() {
    return this.asyncLocalStorage.getMsg();
  }

  _getApiConfig() {
    return this.asyncLocalStorage.getApiConfig();
  }

  /**
   * @param {import('node-red').NodeContext['global']} globalContext
   * @param {string} access token
   * @returns {void}
   */
  setAccessToken(globalContext, accessToken) {
    const apiConfig = this._getApiConfig();
    globalContext.set(GLOBAL_ACCESS_TOKEN_KEY(apiConfig), accessToken);
  }

  /**
   * @param {import('node-red').NodeContext['global']} globalContext
   * @param {'test' | 'live'} mode
   * @returns {void}
   */
  setApiMode(globalContext, mode) {
    const apiConfig = this._getApiConfig();
    globalContext.set(GLOBAL_MODE_KEY(apiConfig), mode);
  }

  /**
   * @param {import('node-red').NodeContext['global']} globalContext
   * @param {string} company id
   * @returns {void}
   */
  setCurrentCompanyId(globalContext, accessToken) {
    const apiConfig = this._getApiConfig();
    globalContext.set(GLOBAL_COMPANY_ID_KEY(apiConfig), accessToken);
  }
}

module.exports = Setters;
