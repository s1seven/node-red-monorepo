module.exports = function (RED) {
  const { generatePdf } = require('@s1seven/schema-tools-generate-pdf');

  function generatePdfNode(config) {
    /** @type NodeRedNode */
    const node = this;
    RED.nodes.createNode(node, config);
    node.on('input', async function (msg) {
      const certificate = msg.payload;
      try {
        const pdf = await generatePdf(certificate);
        msg.payload = pdf;
        node.send(msg);
      } catch (err) {
        node.error(err);
      }
    });
  }
  RED.nodes.registerType('generate pdf', generatePdfNode);
};
