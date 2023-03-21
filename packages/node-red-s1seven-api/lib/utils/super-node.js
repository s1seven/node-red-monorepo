/// <reference path="typedefs.js" />

const EventEmitter = require('events');
const { container } = require('./container');
const { onInputFactory } = require('./on-input');

class SuperNode extends EventEmitter {
  /**
   * @param {RED_JS} RED
   * @param {NodeRedNodeConfig} config
   * @param {NodeRedNode} node
   **/
  constructor(RED, config, node) {
    super({ captureRejections: true });
    /** @type {NodeRedNodeConfig} */
    this.config = config;
    /** @type {NodeRedNode} */
    this._node = node;
    RED.nodes.createNode(node, config);
    /** @type {ApiConfig} */
    this.apiConfig = RED.nodes.getNode(config.apiConfig);
    /** @type {import('./getters')} */
    this.getters = container.resolve('getters');
    /** @type {import('./axios-helpers')} */
    this.axiosHelpers = container.resolve('axiosHelpers');

    /** @type NodeInputHandler */
    const onInput = onInputFactory(this.apiConfig).bind(this);
    node.on('input', onInput);
  }

  // wrap getters methods

  getApiEnvironment() {
    return this.getters.getApiEnvironment();
  }

  getApiUrl() {
    return this.getters.getApiUrl();
  }

  getCurrentCompanyId() {
    return this.getters.getCurrentCompanyId();
  }

  getAccessToken() {
    return this.getters.getAccessToken();
  }

  getApiMode() {
    return this.getters.getApiMode();
  }

  // wrap axios-helpers methods
  createAxiosInstance() {
    return this.axiosHelpers.createAxiosInstance();
  }

  requestHandler() {
    return this.axiosHelpers.requestHandler(...arguments);
  }

  // wrap node-red node methods
  context() {
    return this._node.context();
  }

  debug(msg) {
    this._node.debug(msg);
  }

  log(msg) {
    this._node.log(msg);
  }

  warn(msg) {
    this._node.warn(msg);
  }

  error(msg) {
    this._node.error(msg);
  }

  debug(msg) {
    this._node.debug(msg);
  }

  trace(msg) {
    this._node.trace(msg);
  }
}

module.exports = SuperNode;
