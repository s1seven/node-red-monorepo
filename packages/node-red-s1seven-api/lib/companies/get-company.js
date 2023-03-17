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
  const { exitContext, setNewContext } = container.resolve('asyncLocalStorage');
  /** @type {import('../utils/getters')} */
  const getters = container.resolve('getters');
  /** @type {import('../utils/axios-helpers')} */
  const axiosHelpers = container.resolve('axiosHelpers');

  function getCompany(config) {
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

      const axios = axiosHelpers.createAxiosInstance(globalContext);
      const { success, data } = await axiosHelpers.requestHandler(
        axios.get(`/companies/${companyId}`),
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
  RED.nodes.registerType('get company', getCompany);
};
