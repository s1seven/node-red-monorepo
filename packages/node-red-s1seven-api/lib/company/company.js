module.exports = function (RED) {
  'use strict';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const axios = require('axios');
  const { URL_TO_ENV_MAP } = require('../../resources/constants');
  const S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function getCompany(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, done) => {
      const accessToken = msg.accessToken || apiConfig?.accessToken;
      const environment =
        msg.environment || apiConfig?.environment || 'production';
      const companyId = msg.companyId || apiConfig?.companyId;
      const BASE_URL = URL_TO_ENV_MAP[environment];
      const url = `${
        S1SEVEN_BASE_URL ? S1SEVEN_BASE_URL : BASE_URL
      }/api/companies/${companyId}`;

      if (!accessToken) {
        node.warn(RED._('company.errors.accessToken'));
        done();
      } else if (!companyId) {
        node.warn(RED._('company.errors.companyId'));
        done();
      } else {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          msg.payload = response.data;
          send(msg);
          done();
        } catch (error) {
          if (error instanceof axios.AxiosError) {
            node.error(error.response);
            done(error.response);
          } else {
            node.error(error);
            done(error);
          }
        }
      }
    });
  }
  RED.nodes.registerType('get company', getCompany);
};
