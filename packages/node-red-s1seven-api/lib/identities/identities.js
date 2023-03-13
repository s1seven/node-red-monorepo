module.exports = function (RED) {
  'use strict';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const { get } = require('axios');
  const requestHandler = require('../utils/requestHandler');
  const {
    URL_TO_ENV_MAP,
    DEFAULT_API_VERSION,
    GLOBAL_MODE_KEY,
    GLOBAL_ACCESS_TOKEN_KEY,
  } = require('../../resources/constants');
  const S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function getIdentities(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = this.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, done) => {
      const accessToken =
        msg.accessToken || globalContext.get(GLOBAL_ACCESS_TOKEN_KEY);
      const companyId =
        msg.companyId || apiConfig?.companyId || globalContext.get('companyId');
      const mode = msg.mode || globalContext.get(GLOBAL_MODE_KEY) || 'test';
      const environment =
        msg.environment || apiConfig?.environment || 'production';
      const BASE_URL = URL_TO_ENV_MAP[environment];
      const coinType = msg.coinType || config.coinType || null;
      const status = msg.status || config.status || null;
      const BIP44Account = msg.BIP44Account || config.BIP44Account || null;
      const BIP44Index = msg.BIP44Index || config.BIP44Index || null;
      const url = `${
        S1SEVEN_BASE_URL ? S1SEVEN_BASE_URL : BASE_URL
      }/api/identities`;
      const version = apiConfig?.version || DEFAULT_API_VERSION;

      if (!accessToken) {
        node.warn(RED._('identity.errors.accessToken'));
        done();
      } else if (!companyId) {
        node.warn(RED._('identity.errors.companyId'));
        done();
      } else {
        const { success, data } = await requestHandler(
          get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              company: companyId,
              'x-version': `${version}`,
            },
            params: {
              coinType,
              status,
              account: BIP44Account,
              index: BIP44Index,
              mode,
            },
          }),
          send,
          msg
        );

        if (success) {
          done();
        } else {
          node.error(data);
          done(data);
        }
      }
    });
  }
  RED.nodes.registerType('get identities', getIdentities);
};
