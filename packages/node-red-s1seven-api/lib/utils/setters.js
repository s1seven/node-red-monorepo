const { getApiConfig } = require('./async-local-storage');
const {
  GLOBAL_ACCESS_TOKEN_KEY,
  GLOBAL_COMPANY_ID_KEY,
  GLOBAL_MODE_KEY,
} = require('./getters');

/**
 * @param {import('node-red').NodeContext['global']} globalContext
 * @param {string} access token
 * @returns {void}
 */
function setAccessToken(globalContext, accessToken) {
  const apiConfig = getApiConfig();
  globalContext.set(GLOBAL_ACCESS_TOKEN_KEY(apiConfig), accessToken);
}

/**
 * @param {import('node-red').NodeContext['global']} globalContext
 * @param {'test' | 'live'} mode
 * @returns {void}
 */
function setApiMode(globalContext, mode) {
  const apiConfig = getApiConfig();
  globalContext.set(GLOBAL_MODE_KEY(apiConfig), mode);
}

/**
 * @param {import('node-red').NodeContext['global']} globalContext
 * @param {string} company id
 * @returns {void}
 */
function setCurrentCompanyId(globalContext, accessToken) {
  const apiConfig = getApiConfig();
  globalContext.set(GLOBAL_COMPANY_ID_KEY(apiConfig), accessToken);
}

module.exports = {
  setAccessToken,
  setCurrentCompanyId,
  setApiMode,
};
