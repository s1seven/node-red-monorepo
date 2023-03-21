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
  const { asClass } = require('awilix');
  const SuperNode = require('../utils/super-node');
  const { container } = require('../utils/container');
  const validateCertificate = require('../utils/validateCertificate');

  const scope = container.createScope();
  scope.register({
    setters: asClass(require('../utils/setters')).singleton(),
    getters: asClass(require('../utils/getters')).singleton(),
  });

  /** @type {import('../utils/axios-helpers')} */
  const axiosHelpers = container.resolve('axiosHelpers');

  /** @param {object} config
   * @param {string} config.name
   * @param {string} config.apiConfig
   * @this NodeRedNode
   */
  function validateCertificateNode(config) {
    const node = new SuperNode(RED, config, this);

    node.on('msg', async (msg, send, done) => {
      let certificate = msg.payload || node.context().global.get('certificate');
      const accessToken = node.getAccessToken();
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('validate.errors.validCertificate'));
        done();
        return;
      }
      if (!accessToken) {
        node.warn(RED._('validate.errors.accessToken'));
        done();
        return;
      }

      const axios = node.createAxiosInstance();
      const { success, data } = await axiosHelpers.requestHandler(
        axios.post('/certificates/validate', certificate),
        send
      );

      !success && node.error(data);
      done();
    });
  }
  RED.nodes.registerType('validate certificate', validateCertificateNode);
};
