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
   * @param {string} config.coinType
   * @param {string} config.status
   * @param {string} config.BIP44Account
   * @param {string} config.BIP44Index
   */
  function getIdentities(config) {
    /** @type {import('../utils/getters')} */
    const getters = container.resolve('getters');
    /** @type {import('../utils/axios-helpers')} */
    const axiosHelpers = container.resolve('axiosHelpers');
    /** @type NodeRedNode */
    const node = this;
    RED.nodes.createNode(node, config);
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('msg', async (msg, send, done) => {
      const companyId = getters.getCurrentCompanyId();
      const accessToken = getters.getAccessToken();
      const mode = getters.getApiMode();
      // identities request parameters
      const coinType = msg.coinType || config.coinType || null;
      const status = msg.status || config.status || null;
      const BIP44Account = msg.BIP44Account || config.BIP44Account || null;
      const BIP44Index = msg.BIP44Index || config.BIP44Index || null;

      if (!accessToken) {
        node.warn(RED._('identities.errors.accessToken'));
        done();
        return;
      }
      if (!companyId) {
        node.warn(RED._('identities.errors.companyId'));
        done();
        return;
      }

      const axios = axiosHelpers.createAxiosInstance();
      const { success, data } = await axiosHelpers.requestHandler(
        axios.get('/identities', {
          params: {
            coinType,
            status,
            account: BIP44Account,
            index: BIP44Index,
            mode,
          },
        }),
        send
      );

      !success && node.error(data);
      done();
    });

    const onInput = onInputFactory(apiConfig).bind(node);
    node.on('input', onInput);
  }
  RED.nodes.registerType('get identities', getIdentities);
};
