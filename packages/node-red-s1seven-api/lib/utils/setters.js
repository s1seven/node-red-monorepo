const { getApiConfig } = require('./async-local-storage');
const { GLOBAL_MODE_KEY, GLOBAL_ACCESS_TOKEN_KEY } = require('./getters');

function setApiMode(globalContext, mode) {
  const apiConfig = getApiConfig();
  globalContext.set(GLOBAL_MODE_KEY(apiConfig), mode);
}

function setAccessToken(globalContext, accessToken) {
  const apiConfig = getApiConfig();
  globalContext.set(GLOBAL_ACCESS_TOKEN_KEY(apiConfig), accessToken);
}

module.exports = {
  setApiMode,
  setAccessToken,
};
