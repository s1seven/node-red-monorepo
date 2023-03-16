module.exports = function (RED) {
  'use strict';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const { post } = require('axios');
  const requestHandler = require('../utils/requestHandler');
  const {
    URL_TO_ENV_MAP,
    DEFAULT_API_ENVIRONMENT,
    DEFAULT_API_VERSION,
    GLOBAL_MODE_KEY,
    GLOBAL_ACCESS_TOKEN_KEY,
  } = require('../../resources/constants');
  const S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;

  function getAccessToken(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = node.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, done) => {
      const clientId = msg.clientId || apiConfig?.credentials.clientId;
      const clientSecret =
        msg.clientSecret || apiConfig?.credentials.clientSecret;
      const environment =
        msg.environment || apiConfig?.environment || DEFAULT_API_ENVIRONMENT;
      const version = apiConfig?.version || DEFAULT_API_VERSION;
      const BASE_URL = URL_TO_ENV_MAP[environment];
      const url = `${S1SEVEN_BASE_URL || BASE_URL}/api/tokens`;

      if (!clientId) {
        node.warn(RED._('tokens.errors.clientId'));
        done();
      } else if (!clientSecret) {
        node.warn(RED._('tokens.errors.clientSecret'));
        done();
      } else {
        const { success, data } = await requestHandler(
          post(url, {
            clientId,
            clientSecret,
            headers: {
              'x-version': `${version}`,
            },
          }),
          send,
          msg
        );

        if (success) {
          globalContext.set(
            GLOBAL_ACCESS_TOKEN_KEY(apiConfig),
            data.accessToken
          );
          globalContext.set(GLOBAL_MODE_KEY(apiConfig), data.application.mode);
          node.warn('Access token fetched successfully');
          done();
        } else {
          node.error(data);
          done(data);
        }
      }
    });
  }
  RED.nodes.registerType('get access token', getAccessToken);
};
