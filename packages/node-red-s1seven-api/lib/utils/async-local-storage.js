const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function getMsg() {
  return asyncLocalStorage.getStore()?.get('msg');
}

function setMsg(msg) {
  asyncLocalStorage.getStore()?.set('msg', msg);
}

function getApiConfig() {
  return asyncLocalStorage.getStore()?.get('apiConfig');
}

function setApiConfig(apiConfig) {
  asyncLocalStorage.getStore()?.set('apiConfig', apiConfig);
}

function setNewContext(apiConfig, msg) {
  asyncLocalStorage.enterWith(new Map());
  setApiConfig(apiConfig);
  setMsg(msg);
  asyncLocalStorage
    .getStore()
    ?.set('S1SEVEN_BASE_URL', process.env.S1SEVEN_BASE_URL);
}

function exitContext(done, err) {
  asyncLocalStorage.exit(done, err);
}

module.exports = {
  asyncLocalStorage,
  getApiConfig,
  getMsg,
  setApiConfig,
  setMsg,
  setNewContext,
  exitContext,
};
