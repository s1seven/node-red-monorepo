/**
 * @type {RED_JS}
 */
module.exports = function (RED) {
  const { URL_TO_ENV_MAP } = require('../../resources/constants');
  const { GLOBAL_BASE_URL_KEY } = require('../utils/keys');

  /** @param {object} config
   * @param {ApiEnvironment} config.environment
   * @param {string} config.name
   * @param {number} config.apiVersion
   * @this NodeRedNode
   */
  function RemoteServerNode(config) {
    RED.nodes.createNode(this, config);
    this.environment = config.environment;
    this.name = config.name;
    this.apiVersion = config.apiVersion;
    this.baseUrl = URL_TO_ENV_MAP[config.environment];
    this.context().global.set(GLOBAL_BASE_URL_KEY(this), this.baseUrl);
  }
  RED.nodes.registerType('api-config', RemoteServerNode, {
    credentials: {
      clientId: { type: 'text' },
      clientSecret: { type: 'password' },
    },
  });
};
