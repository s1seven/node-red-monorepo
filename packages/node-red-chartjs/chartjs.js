module.exports = function (RED) {
  function chartJs(config) {
    /** @type NodeRedNode */
    const node = this;
    RED.nodes.createNode(node, config);
    node.on('input', function (msg) {
      node.send(msg);
    });
  }
  RED.nodes.registerType('generate chart', chartJs);
};
