module.exports = function (RED) {
  'use strict';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const { post } = require('axios');
  const requestHandler = require('../utils/requestHandler');
  const {
    URL_TO_ENV_MAP,
    DEFAULT_API_VERSION,
    GLOBAL_MODE_KEY,
    GLOBAL_ACCESS_TOKEN_KEY,
  } = require('../../resources/constants');
  const validateCertificate = require('../utils/validateCertificate');
  const S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function notarize(config) {
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
      const identity =
        msg.identity || config.identity || globalContext.get('identity');
      const environment =
        msg.environment || apiConfig?.environment || 'production';
      const BASE_URL = URL_TO_ENV_MAP[environment];
      const url = `${S1SEVEN_BASE_URL || BASE_URL}/api/certificates/notarize`;
      let certificate = msg.payload || globalContext.get('certificate');
      const version = apiConfig?.version || DEFAULT_API_VERSION;

      if (!accessToken) {
        node.warn(RED._('notarize.errors.accessToken'));
        done();
      } else if (!companyId) {
        node.warn(RED._('notarize.errors.companyId'));
        done();
      } else if (!identity) {
        node.warn(RED._('notarize.errors.identity'));
        done();
      } else if (certificate) {
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
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              company: companyId,
              'x-version': `${version}`,
            },
            params: {
              identity,
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
      } else {
        node.warn(RED._('notarize.errors.validCertificate'));
        done();
      }
    });
  }
  RED.nodes.registerType('notarize certificate', notarize);
};
