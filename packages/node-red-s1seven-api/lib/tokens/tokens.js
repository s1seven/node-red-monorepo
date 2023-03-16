'use strict';

module.exports = function (RED) {
  const path = require('node:path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

  const {
    exitContext,
    setNewContext,
  } = require('../utils/async-local-storage');
  const { createAxiosInstance } = require('../utils/axios');
  const requestHandler = require('../utils/requestHandler');
  const {
    setAccessToken,
    setApiMode,
    setCurrentCompanyId,
  } = require('../utils/setters');

  function getAccessToken(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = node.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, cb) => {
      function done(err) {
        exitContext(cb, err);
      }
      setNewContext(apiConfig, msg);

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
      const axios = createAxiosInstance(globalContext);
      const { success, data } = await requestHandler(
        axios.post('/tokens', {
          clientId,
          clientSecret,
        }),
        send
      );

      if (success) {
        setAccessToken(globalContext, data.accessToken);
        setApiMode(globalContext, data.application.mode);
        setCurrentCompanyId(globalContext, data.application.owner.id);
        // node.warn('Access token fetched successfully');
        done();
      } else {
        setAccessToken(globalContext, undefined);
        setApiMode(globalContext, undefined);
        setCurrentCompanyId(globalContext, undefined);
        node.error(data);
        done(data);
      }
    });
  }
  RED.nodes.registerType('get access token', getAccessToken);
};
