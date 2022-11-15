module.exports = function (RED) {
  function chartJs(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.on('input', function (msg) {
      node.send(msg);
    });
  }
  RED.nodes.registerType('generate chart', chartJs);
};
