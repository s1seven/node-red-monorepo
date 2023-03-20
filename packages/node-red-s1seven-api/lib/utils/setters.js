const {
  GLOBAL_ACCESS_TOKEN_KEY,
  GLOBAL_COMPANY_ID_KEY,
  GLOBAL_MODE_KEY,
} = require('./keys');

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

  _getGlobalContext() {
    return this.asyncLocalStorage.getGlobalContext();
  }

  /**
   * @param {string} access token
   * @returns {void}
   */
  setAccessToken(accessToken) {
    const apiConfig = this._getApiConfig();
    const globalContext = this._getGlobalContext();
    globalContext.set(GLOBAL_ACCESS_TOKEN_KEY(apiConfig), accessToken);
  }

  /**
   * @param {'test' | 'live'} mode
   * @returns {void}
   */
  setApiMode(mode) {
    const apiConfig = this._getApiConfig();
    const globalContext = this._getGlobalContext();
    globalContext.set(GLOBAL_MODE_KEY(apiConfig), mode);
  }

  /**
   * @param {string} company id
   * @returns {void}
   */
  setCurrentCompanyId(accessToken) {
    const apiConfig = this._getApiConfig();
    const globalContext = this._getGlobalContext();
    globalContext.set(GLOBAL_COMPANY_ID_KEY(apiConfig), accessToken);
  }
}

module.exports = Setters;
