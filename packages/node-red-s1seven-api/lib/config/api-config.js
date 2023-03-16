module.exports = function (RED) {
  function RemoteServerNode(n) {
    RED.nodes.createNode(this, n);
    this.environment = n.environment;
    this.name = n.name;
    this.apiVersion = n.apiVersion;
  }
  RED.nodes.registerType('api-config', RemoteServerNode, {
    credentials: {
      clientId: { type: 'text' },
      clientSecret: { type: 'password' },
    },
  });
};
