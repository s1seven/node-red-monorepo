/// <reference path="typedefs.js" />

const { AsyncLocalStorage } = require('node:async_hooks');
const { isApiConfig, isGlobalContext, isNodeMessage } = require('./guards');

const asyncLocalStorage = new AsyncLocalStorage();

/**
 * @returns {NodeMessage}
 * @see https://nodered.org/docs/creating-nodes/node-js#node-message-object
 */
function getMsg() {
  return asyncLocalStorage.getStore()?.get('msg') || {};
}

/**
 * @param {NodeMessage} msg
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
 * @param {ApiConfig} apiConfig
 * @returns {void}
 */
function setApiConfig(apiConfig) {
  asyncLocalStorage.getStore()?.set('apiConfig', apiConfig);
}

/**
 * @returns {GlobalContext}
 * @see https://nodered.org/docs/creating-nodes/context
 */
function getGlobalContext() {
  return asyncLocalStorage.getStore()?.get('globalContext') || {};
}

/**
 * @param {GlobalContext} globalContext
 * @returns {void}
 */
function setGlobalContext(globalContext) {
  asyncLocalStorage.getStore()?.set('globalContext', globalContext);
}

/**
 * @typedef {object} InitOptions
 * @property {ApiConfig} apiConfig
 * @property {NodeMessage} msg
 * @property {GlobalContext} globalContext
 */

/**
 * @param {InitOptions} options
 * @returns {void}
 * @see https://nodejs.org/api/async_hooks.html#async_hooks_asynclocalstorage_enterwith
 * @see https://nodejs.org/api/async_hooks.html#async_hooks_asynclocalstorage_getstore
 *
 */
function init(options) {
  const { apiConfig, globalContext, msg } = options;
  asyncLocalStorage.enterWith(new Map());
  if (!isApiConfig(apiConfig)) {
    throw new TypeError(
      'apiConfig must be an object with apiVersion and environment'
    );
  }
  if (!isNodeMessage(msg)) {
    throw new TypeError('msg must be an object');
  }
  if (!isGlobalContext(globalContext)) {
    throw new TypeError(
      'globalContext must be an object with set(), get(), and keys() methods'
    );
  }
  setApiConfig(apiConfig);
  setMsg(msg);
  setGlobalContext(globalContext);
  asyncLocalStorage
    .getStore()
    ?.set('S1SEVEN_BASE_URL', process.env.S1SEVEN_BASE_URL);
}

/**
 * @param {function} done
 * @param {Error | undefined} err
 * @returns {void}
 * @see https://nodejs.org/api/async_hooks.html#async_hooks_asynclocalstorage_exit
 */
function exit(done, err) {
  asyncLocalStorage.exit(done, err);
}

class AsyncLocalStore {
  _asyncLocalStorage = asyncLocalStorage;
  getMsg = getMsg;
  setMsg = setMsg;
  getApiConfig = getApiConfig;
  setApiConfig = setApiConfig;
  getGlobalContext = getGlobalContext;
  setGlobalContext = setGlobalContext;
  init = init;
  exit = exit;
}

module.exports = AsyncLocalStore;
