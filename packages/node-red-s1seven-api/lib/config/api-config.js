module.exports = function (RED) {
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
  }
  RED.nodes.registerType('api-config', RemoteServerNode, {
    credentials: {
      clientId: { type: 'text' },
      clientSecret: { type: 'password' },
    },
  });
};
