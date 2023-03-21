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
   * @param {string} config.coinType
   * @param {string} config.status
   * @param {string} config.BIP44Account
   * @param {string} config.BIP44Index
   * @this NodeRedNode
   */
  function getIdentities(config) {
    const node = new SuperNode(RED, config, this);
    node.on('msg', async (msg, send, done) => {
      const companyId = node.getCurrentCompanyId();
      const accessToken = node.getAccessToken();
      const mode = node.getApiMode();
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

      const axios = node.createAxiosInstance();
      const { success, data } = await node.requestHandler(
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
  }
  RED.nodes.registerType('get identities', getIdentities);
};
