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
  const {
    ALGORITHM_OPTIONS,
    ENCODING_OPTIONS,
  } = require('../../resources/constants');

  /** @param {object} config
   * @param {string} config.name
   * @param {string} config.apiConfig
   * @param {string} config.algorithm
   * @param {string} config.encoding
   * @this NodeRedNode
   */
  function hashCertificate(config) {
    const node = new SuperNode(RED, config, this);

    node.on('msg', async (msg, send, done) => {
      const accessToken = node.getAccessToken();
      // request parameters
      const algorithm = msg.algorithm || config.algorithm || 'sha256';
      const encoding = msg.encoding || config.encoding || 'hex';

      if (!accessToken) {
        node.warn(RED._('hash.errors.accessToken'));
        done();
        return;
      }
      if (!ALGORITHM_OPTIONS.includes(algorithm)) {
        node.warn(RED._('hash.errors.algorithm'));
        done();
        return;
      }
      if (!ENCODING_OPTIONS.includes(encoding)) {
        node.warn(RED._('hash.errors.encoding'));
        done();
        return;
      }

      let certificate = msg.payload || node.context().global.get('certificate');
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('hash.errors.validCertificate'));
        done();
        return;
      }

      const axios = node.createAxiosInstance();
      const { success, data } = await node.requestHandler(
        axios.post(`/certificates/hash`, {
          algorithm,
          encoding,
          source: certificate,
        }),
        send
      );

      !success && node.error(data);
      done();
    });
  }
  RED.nodes.registerType('hash certificate', hashCertificate);
};
