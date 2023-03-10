module.exports = function (RED) {
  function RemoteServerNode(n) {
    RED.nodes.createNode(this, n);
    this.companyId = n.companyId;
    this.accessToken = n.accessToken;
    this.mode = n.mode;
    this.environment = n.environment;
    this.name = n.name;
    this.clientId = n.clientId;
    this.clientSecret = n.clientSecret;
    this.apiVersion = n.apiVersion;
  }
  RED.nodes.registerType('api-config', RemoteServerNode);
};
