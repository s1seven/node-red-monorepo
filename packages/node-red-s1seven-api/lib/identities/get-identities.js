'use strict';

module.exports = function (RED) {
  const path = require('node:path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

  const {
    setNewContext,
    exitContext,
  } = require('../utils/async-local-storage');
  const { createAxiosInstance } = require('../utils/axios');
  const {
    getApiMode,
    getCurrentCompanyId,
    getAccessToken,
  } = require('../utils/getters');
  const requestHandler = require('../utils/requestHandler');

  function getIdentities(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = this.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, cb) => {
      function done(err) {
        exitContext(cb, err);
      }
      setNewContext(apiConfig, msg);

      const companyId = getCurrentCompanyId(globalContext);
      const accessToken = getAccessToken(globalContext);
      const mode = getApiMode(globalContext);
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

      const axios = createAxiosInstance(globalContext);
      const { success, data } = await requestHandler(
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

      if (success) {
        done();
      } else {
        // node.error(data);
        done(data);
      }
    });
  }
  RED.nodes.registerType('get identities', getIdentities);
};
