const { format } = require('node:util');

const {
  DEFAULT_API_ENVIRONMENT,
  DEFAULT_API_VERSION,
  URL_TO_ENV_MAP,
  GLOBAL_MODE_KEY_PATTERN,
  GLOBAL_ACCESS_TOKEN_KEY_PATTERN,
  DEFAULT_API_MODE,
} = require('../../resources/constants');
const { getMsg, getApiConfig } = require('./async-local-storage');

// configNodeIdentifier should be either the node name and if undefined the node id
const GLOBAL_ACCESS_TOKEN_KEY = (configNode) =>
  format(GLOBAL_ACCESS_TOKEN_KEY_PATTERN, configNode.name || configNode.id);

const GLOBAL_MODE_KEY = (configNode) =>
  format(GLOBAL_MODE_KEY_PATTERN, configNode.name || configNode.id);

function getApiEnvironment() {
  const msg = getMsg();
  const apiConfig = getApiConfig();
  return msg.environment || apiConfig?.environment || DEFAULT_API_ENVIRONMENT;
}

function getApiUrl() {
  const environment = getApiEnvironment();
  const S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;
  // const S1SEVEN_BASE_URL = asyncLocalStorage.getStore().get('S1SEVEN_BASE_URL');
  const BASE_URL = URL_TO_ENV_MAP[environment];
  return `${S1SEVEN_BASE_URL || BASE_URL}/api`;
}

function getApiVersion() {
  const apiConfig = getApiConfig();
  return apiConfig?.version || DEFAULT_API_VERSION;
}

function getApiMode(globalContext) {
  const msg = getMsg();
  const apiConfig = getApiConfig();
  return (
    msg.mode ||
    globalContext.get(GLOBAL_MODE_KEY(apiConfig)) ||
    DEFAULT_API_MODE
  );
}

function getAccessToken(globalContext) {
  const msg = getMsg();
  const apiConfig = getApiConfig();
  return (
    msg.accessToken || globalContext.get(GLOBAL_ACCESS_TOKEN_KEY(apiConfig))
  );
}

function getCurrentCompanyId(globalContext) {
  const msg = getMsg();
  const apiConfig = getApiConfig();
  return (
    msg.companyId || apiConfig?.companyId || globalContext.get('companyId')
  );
}

module.exports = {
  getApiEnvironment,
  getApiMode,
  getApiUrl,
  getApiVersion,
  getAccessToken,
  getCurrentCompanyId,
  GLOBAL_ACCESS_TOKEN_KEY,
  GLOBAL_MODE_KEY,
};
