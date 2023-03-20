/// <reference path="typedefs.js" />

/**
 * @param {ApiConfig} apiConfig
 * @returns {boolean}
 */
function isApiConfig(apiConfig) {
  return (
    apiConfig &&
    typeof apiConfig === 'object' &&
    typeof apiConfig.id === 'string' &&
    typeof apiConfig.credentials === 'object' &&
    typeof apiConfig.credentials.clientId === 'string' &&
    typeof apiConfig.credentials.clientSecret === 'string' &&
    typeof apiConfig.environment === 'string' &&
    (typeof apiConfig.apiVersion === 'number' ||
      (typeof apiConfig.apiVersion === 'string' &&
        !isNaN(Number(apiConfig.apiVersion))))
  );
}

/**
 * @param {GlobalContext} globalContext
 * @returns {boolean}
 */
function isGlobalContext(globalContext) {
  return (
    globalContext &&
    typeof globalContext === 'object' &&
    typeof globalContext.set === 'function' &&
    typeof globalContext.get === 'function' &&
    typeof globalContext.keys === 'function'
  );
}

/**
 * @param {NodeMessage} msg
 * @returns {boolean}
 */
function isNodeMessage(msg) {
  return msg && typeof msg === 'object';
}

module.exports = {
  isApiConfig,
  isGlobalContext,
  isNodeMessage,
};
