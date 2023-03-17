/// <reference path="typedefs.js" />

const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

/**
 * @returns {NodeMessage}
 * @see https://nodered.org/docs/creating-nodes/node-js#node-message-object
 */
function getMsg() {
  return asyncLocalStorage.getStore()?.get('msg') || {};
}

/**
 * @params {NodeMessage} msg
 * @returns {void}
 */
function setMsg(msg) {
  asyncLocalStorage.getStore()?.set('msg', msg);
}

/**
 * @returns {ApiConfig} apiConfig
 */
function getApiConfig() {
  return asyncLocalStorage.getStore()?.get('apiConfig') || {};
}

/**
 * @params {ApiConfig} apiConfig
 * @returns {void}
 */
function setApiConfig(apiConfig) {
  asyncLocalStorage.getStore()?.set('apiConfig', apiConfig);
}

/**
 * @params {ApiConfig} apiConfig
 * @params {NodeMessage} msg
 * @returns {void}
 * @see https://nodejs.org/api/async_hooks.html#async_hooks_asynclocalstorage_enterwith
 * @see https://nodejs.org/api/async_hooks.html#async_hooks_asynclocalstorage_getstore
 *
 */
function setNewContext(apiConfig, msg) {
  asyncLocalStorage.enterWith(new Map());
  setApiConfig(apiConfig);
  setMsg(msg);
  asyncLocalStorage
    .getStore()
    ?.set('S1SEVEN_BASE_URL', process.env.S1SEVEN_BASE_URL);
}

/**
 * @param {function} done
 * @param {Error | undefined} err
 * @returns {void}
 *
 * @see https://nodejs.org/api/async_hooks.html#async_hooks_asynclocalstorage_exit
 */
function exitContext(done, err) {
  asyncLocalStorage.exit(done, err);
}

class AsyncLocalStore {
  getMsg = getMsg;
  setMsg = setMsg;
  getApiConfig = getApiConfig;
  setApiConfig = setApiConfig;
  setNewContext = setNewContext;
  exitContext = exitContext;
}

module.exports = AsyncLocalStore;
