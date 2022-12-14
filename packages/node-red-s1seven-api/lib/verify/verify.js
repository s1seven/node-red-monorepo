module.exports = function (RED) {
  'use strict';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const axios = require('axios');
  const { URL_TO_ENV_MAP } = require('../../resources/constants');
  const validateCertificate = require('../utils/validateCertificate');
  const S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function verifyCertificateNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = this.context().global;

    node.on('input', async (msg, send, done) => {
      const apiConfig = RED.nodes.getNode(config.apiConfig);
      const accessToken =
        msg.accessToken ||
        apiConfig?.accessToken ||
        globalContext.get('accessToken');
      let certificate = msg.payload || globalContext.get('certificate');
      const mode = msg.mode || apiConfig?.mode || 'test';
      const environment =
        msg.environment || apiConfig?.environment || 'production';
      const BASE_URL = URL_TO_ENV_MAP[environment];
      const url = `${
        S1SEVEN_BASE_URL ? S1SEVEN_BASE_URL : BASE_URL
      }/api/certificates/verify/?mode=${mode}`;

      if (certificate) {
        try {
          certificate = validateCertificate(certificate);
          const response = await axios.post(url, certificate, {
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken
                ? { Authentication: `bearer ${accessToken}` }
                : {}),
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
      } else {
        node.warn(RED._('verify.errors.validCertificate'));
        done();
      }
    });
  }
  RED.nodes.registerType('verify certificate', verifyCertificateNode);
};
