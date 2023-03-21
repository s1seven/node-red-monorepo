class AsyncLocalStorageMock {
  constructor() {
    this.store = new Map();
  }

  getMsg() {
    return this.store?.get('msg') || {};
  }

  setMsg(msg) {
    this.store?.set('msg', msg);
  }
  getApiConfig() {
    return this.store?.get('apiConfig') || {};
  }

  setApiConfig(apiConfig) {
    this.store?.set('apiConfig', apiConfig);
  }

  getGlobalContext() {
    return this.store?.get('globalContext') || {};
  }

  setGlobalContext(globalContext) {
    this.store?.set('globalContext', globalContext);
  }

  init({ apiConfig, msg, globalContext }) {
    this.store = new Map();
    this.setApiConfig(apiConfig);
    this.setMsg(msg);
    this.setGlobalContext(globalContext);
  }

  exit() {
    this.store = new Map();
  }
}

module.exports = AsyncLocalStorageMock;
