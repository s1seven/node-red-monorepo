module.exports = function (RED) {
  'use strict';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const { get } = require('axios');
  const requestHandler = require('../utils/requestHandler');
  const {
    URL_TO_ENV_MAP,
    DEFAULT_API_VERSION,
  } = require('../../resources/constants');
  const S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;

  function getCompany(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = this.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, done) => {
      const accessToken =
        msg.accessToken || globalContext.get('s1sevenAccessToken');
      const environment =
        msg.environment || apiConfig?.environment || 'production';
      const companyId = msg.companyId || apiConfig?.companyId;
      const BASE_URL = URL_TO_ENV_MAP[environment];
      const url = `${
        S1SEVEN_BASE_URL ? S1SEVEN_BASE_URL : BASE_URL
      }/api/companies/${companyId}`;
      const version = apiConfig?.version || DEFAULT_API_VERSION;

      if (!accessToken) {
        node.warn(RED._('company.errors.accessToken'));
        done();
      } else if (!companyId) {
        node.warn(RED._('company.errors.companyId'));
        done();
      } else {
        const { success, data } = await requestHandler(
          get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'x-version': `${version}`,
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
  RED.nodes.registerType('get company', getCompany);
};
