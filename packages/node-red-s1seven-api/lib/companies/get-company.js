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

  /** @param {object} config
   * @param {string} config.name
   * @param {string} config.apiConfig
   * @this NodeRedNode
   */
  function getCompany(config) {
    const node = new SuperNode(RED, config, this);

    node.on('msg', async (_msg, send, done) => {
      const companyId = node.getCurrentCompanyId();
      const accessToken = node.getAccessToken();
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

      const axios = node.createAxiosInstance();
      const { success, data } = await node.requestHandler(
        axios.get(`/companies/${companyId}`),
        send
      );

      !success && node.error(data);
      done();
    });
  }
  RED.nodes.registerType('get company', getCompany);
};
