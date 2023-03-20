'use strict';

const { asClass } = require('awilix');

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
  const scope = container.createScope();
  scope.register({
    setters: asClass(require('../utils/setters')).singleton(),
  });

  /** @type {import('../utils/async-local-storage')} */
  const { exit, init } = container.resolve('asyncLocalStorage');
  /** @type {import('../utils/axios-helpers')} */
  const axiosHelpers = container.resolve('axiosHelpers');
  /** @type {import('../utils/setters')} */
  const setters = scope.resolve('setters');

  function getAccessToken(config) {
    /** @type NodeRedNode */
    const node = this;
    RED.nodes.createNode(node, config);
    const globalContext = node.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, cb) => {
      function done(err) {
        exit(cb, err);
      }
      init({ apiConfig, globalContext, msg });

      const clientId = msg.clientId || apiConfig?.credentials.clientId;
      const clientSecret =
        msg.clientSecret || apiConfig?.credentials.clientSecret;

      if (!clientId) {
        node.warn(RED._('tokens.errors.clientId'));
        done();
        return;
      }
      if (!clientSecret) {
        node.warn(RED._('tokens.errors.clientSecret'));
        done();
        return;
      }
      const axios = axiosHelpers.createAxiosInstance();
      const { success, data } = await axiosHelpers.requestHandler(
        axios.post('/tokens', {
          clientId,
          clientSecret,
        }),
        send
      );

      if (success) {
        setters.setAccessToken(data.accessToken);
        setters.setApiMode(data.application.mode);
        setters.setCurrentCompanyId(data.application.owner.id);
        // node.warn('Access token fetched successfully');
        done();
      } else {
        setters.setAccessToken(undefined);
        setters.setApiMode(undefined);
        setters.setCurrentCompanyId(undefined);
        //? those node errors become really noisy, maybe we should add a debug|verbose mode to enable them on purpose ?
        // node.error(data);
        done(data);
      }
    });
  }
  RED.nodes.registerType('get access token', getAccessToken);
};
