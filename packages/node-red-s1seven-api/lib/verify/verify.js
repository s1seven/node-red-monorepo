module.exports = function (RED) {
  'use strict';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const { post } = require('axios');
  const requestHandler = require('../utils/requestHandler');
  const {
    URL_TO_ENV_MAP,
    DEFAULT_API_VERSION,
  } = require('../../resources/constants');
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
      const mode = msg.mode || config?.mode || 'test';
      const environment =
        msg.environment || apiConfig?.environment || 'production';
      const BASE_URL = URL_TO_ENV_MAP[environment];
      const url = `${
        S1SEVEN_BASE_URL ? S1SEVEN_BASE_URL : BASE_URL
      }/api/certificates/verify/?mode=${mode}`;
      const version = apiConfig?.version || DEFAULT_API_VERSION;

      if (certificate) {
        try {
          certificate = validateCertificate(certificate);
        } catch (error) {
          node.error(error);
          done(error);
          return;
        }

        const { success, data } = await requestHandler(
          post(url, certificate, {
            headers: {
              'Content-Type': 'application/json',
              'x-version': `${version}`,
              ...(accessToken
                ? { Authentication: `bearer ${accessToken}` }
                : {}),
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
      } else {
        node.warn(RED._('verify.errors.validCertificate'));
        done();
      }
    });
  }
  RED.nodes.registerType('verify certificate', verifyCertificateNode);
};
