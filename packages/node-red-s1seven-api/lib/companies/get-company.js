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

  /** @param {object} config
   * @param {string} config.name
   * @param {string} config.apiConfig
   */
  function getCompany(config) {
    /** @type {import('../utils/getters')} */
    const getters = container.resolve('getters');
    /** @type {import('../utils/axios-helpers')} */
    const axiosHelpers = container.resolve('axiosHelpers');

    /** @type NodeRedNode */
    const node = this;
    RED.nodes.createNode(node, config);
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('msg', async (_msg, send, done) => {
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

    const onInput = onInputFactory(apiConfig).bind(node);
    node.on('input', onInput);
  }
  RED.nodes.registerType('get company', getCompany);
};
