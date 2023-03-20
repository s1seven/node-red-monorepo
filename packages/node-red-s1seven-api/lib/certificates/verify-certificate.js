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
  const { container } = require('../utils/container');
  const { onInputFactory } = require('../utils/on-input');
  const validateCertificate = require('../utils/validateCertificate');

  /** @param {object} config
   * @param {string} config.name
   * @param {string} config.apiConfig
   */
  function verifyCertificate(config) {
    /** @type {import('../utils/getters')} */
    const getters = container.resolve('getters');
    /** @type {import('../utils/axios-helpers')} */
    const axiosHelpers = container.resolve('axiosHelpers');
    /** @type NodeRedNode */
    const node = this;
    RED.nodes.createNode(node, config);
    const globalContext = node.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('msg', async (msg, send, done) => {
      const mode = getters.getApiMode();
      let certificate = msg.payload || globalContext.get('certificate');
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('verify.errors.validCertificate'));
        done();
        return;
      }

      const axios = axiosHelpers.createAxiosInstance();
      const { success, data } = await axiosHelpers.requestHandler(
        axios.post('/certificates/verify', certificate, {
          params: { mode },
        }),
        send
      );

      !success && node.error(data);
      done();
    });

    const onInput = onInputFactory(apiConfig).bind(node);
    node.on('input', onInput);
  }
  RED.nodes.registerType('verify certificate', verifyCertificate);
};
