const { readFileSync } = require('node:fs');
const { join } = require('node:path');

/**
 * @type {RED_JS}
 */
module.exports = function (RED) {
  const subflowFile = join(__dirname, 'connect.json');
  const subflowContents = readFileSync(subflowFile);
  const subflowJSON = JSON.parse(subflowContents);
  RED.nodes.registerSubflow(subflowJSON);
};
