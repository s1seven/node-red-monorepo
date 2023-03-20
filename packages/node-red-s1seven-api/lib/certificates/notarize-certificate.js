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
   * @param {string} config.identity
   * @this NodeRedNode
   */
  function notarizeCertificate(config) {
    const node = new SuperNode(RED, config, this);
    node.on('msg', async (msg, send, done) => {
      const companyId = node.getCurrentCompanyId();
      const accessToken = node.getAccessToken();
      const mode = node.getApiMode();

      // request parameters
      const identity =
        msg.identity ||
        config.identity ||
        node.context().global.get('identity');

      if (!accessToken) {
        node.warn(RED._('notarize.errors.accessToken'));
        done();
        return;
      }
      if (!companyId) {
        node.warn(RED._('notarize.errors.companyId'));
        done();
        return;
      }
      if (!identity) {
        node.warn(RED._('notarize.errors.identity'));
        done();
        return;
      }

      let certificate = msg.payload || node.context().global.get('certificate');
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('notarize.errors.validCertificate'));
        done();
        return;
      }

      const axios = node.createAxiosInstance();
      const { success, data } = await node.requestHandler(
        axios.post('/certificates/notarize', certificate, {
          params: {
            identity,
            mode,
          },
        }),
        send
      );

      !success && node.error(data);
      done();
    });
  }
  RED.nodes.registerType('notarize certificate', notarizeCertificate);
};
