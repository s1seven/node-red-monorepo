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
  const validateCertificate = require('../utils/validateCertificate');

  /** @type {import('../utils/async-local-storage')} */
  const { exitContext, setNewContext } = container.resolve('asyncLocalStorage');
  /** @type {import('../utils/getters')} */
  const getters = container.resolve('getters');
  /** @type {import('../utils/axios-helpers')} */
  const axiosHelpers = container.resolve('axiosHelpers');

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function notarizeCertificate(config) {
    /** @type NodeRedNode */
    const node = this;
    RED.nodes.createNode(node, config);
    const globalContext = node.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, cb) => {
      function done(err) {
        exitContext(cb, err);
      }
      setNewContext(apiConfig, msg);

      const companyId = getters.getCurrentCompanyId(globalContext);
      const accessToken = getters.getAccessToken(globalContext);
      const mode = getters.getApiMode(globalContext);

      // request parameters
      const identity =
        msg.identity || config.identity || globalContext.get('identity');
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

      let certificate = msg.payload || globalContext.get('certificate');
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('notarize.errors.validCertificate'));
        done(error);
        return;
      }

      const axios = axiosHelpers.createAxiosInstance(globalContext);
      const { success, data } = await axiosHelpers.requestHandler(
        axios.post('/certificates/notarize', certificate, {
          params: {
            identity,
            mode,
          },
        }),
        send
      );

      if (success) {
        done();
      } else {
        // node.error(data);
        done(data);
      }
    });
  }
  RED.nodes.registerType('notarize certificate', notarizeCertificate);
};
