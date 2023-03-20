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

  /** @type {import('../utils/async-local-storage')} */
  const asyncLocalStorage = container.resolve('asyncLocalStorage');
  /** @type {import('../utils/getters')} */
  const getters = container.resolve('getters');
  /** @type {import('../utils/axios-helpers')} */
  const axiosHelpers = container.resolve('axiosHelpers');

  /** @param {object} config
   * @param {string} config.name
   * @param {string} config.apiConfig
   */
  function getCompany(config) {
    /** @type NodeRedNode */
    const node = this;
    RED.nodes.createNode(node, config);
    const globalContext = node.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, cb) => {
      function done(err) {
        asyncLocalStorage.exit(cb, err);
      }
      asyncLocalStorage.init({ apiConfig, globalContext, msg });
      const companyId = getters.getCurrentCompanyId();
      const accessToken = getters.getAccessToken();
      if (!accessToken) {
        node.warn(RED._('company.errors.accessToken'));
        done();
        return;
      }
      if (!companyId) {
        node.warn(RED._('company.errors.companyId'));
        done();
        return;
      }

      const axios = axiosHelpers.createAxiosInstance();
      const { success, data } = await axiosHelpers.requestHandler(
        axios.get(`/companies/${companyId}`),
        send
      );

      !success && node.error(data);
      done();
    });
  }
  RED.nodes.registerType('get company', getCompany);
};
