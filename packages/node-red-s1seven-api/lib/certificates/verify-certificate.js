'use strict';

require('dotenv').config({
  path: require('node:path').resolve(__dirname, '../../.env'),
});
// we need to setup the container before requiring the node to allow to override the dependencies in the tests
require('../utils/container').setupContainer();

/**
 * @type {RED_JS}
 */
module.exports = function (RED) {
  const SuperNode = require('../utils/super-node');
  const validateCertificate = require('../utils/validateCertificate');

  /** @param {object} config
   * @param {string} config.name
   * @param {string} config.apiConfig
   * @this NodeRedNode
   */
  function verifyCertificate(config) {
    const node = new SuperNode(RED, config, this);
    node.on('msg', async (msg, send, done) => {
      const mode = node.getApiMode();
      let certificate = msg.payload || node.context().global.get('certificate');
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('verify.errors.validCertificate'));
        done();
        return;
      }

      const axios = node.createAxiosInstance();
      const { success, data } = await node.requestHandler(
        axios.post('/certificates/verify', certificate, {
          params: { mode },
        }),
        send
      );

      !success && node.error(data);
      done();
    });
  }
  RED.nodes.registerType('verify certificate', verifyCertificate);
};
