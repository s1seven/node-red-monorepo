module.exports = function (RED) {
  'use strict';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const { post } = require('axios');
  const requestHandler = require('../utils/requestHandler');
  const {
    URL_TO_ENV_MAP,
    ALGORITHM_OPTIONS,
    ENCODING_OPTIONS,
    DEFAULT_API_VERSION,
  } = require('../../resources/constants');
  const validateCertificate = require('../utils/validateCertificate');
  const S1SEVEN_BASE_URL = process.env.S1SEVEN_BASE_URL;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function hashCertificate(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = this.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, done) => {
      let certificate = msg.payload || globalContext.get('certificate');
      const accessToken =
        msg.accessToken || globalContext.get('s1sevenAccessToken');
      const environment =
        msg.environment || apiConfig?.environment || 'production';
      const BASE_URL = URL_TO_ENV_MAP[environment];
      const url = `${
        S1SEVEN_BASE_URL ? S1SEVEN_BASE_URL : BASE_URL
      }/api/certificates/hash`;
      const algorithm = msg.algorithm || config.algorithm || 'sha256';
      const encoding = msg.encoding || config.encoding || 'hex';
      const version = apiConfig?.version || DEFAULT_API_VERSION;

      if (!accessToken) {
        node.warn(RED._('hash.errors.accessToken'));
        done();
      } else if (!ALGORITHM_OPTIONS.includes(algorithm)) {
        node.warn(RED._('hash.errors.algorithm'));
        done();
      } else if (!ENCODING_OPTIONS.includes(encoding)) {
        node.warn(RED._('hash.errors.encoding'));
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
          post(
            url,
            {
              algorithm,
              encoding,
              source: certificate,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'x-version': `${version}`,
              },
            }
          ),
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
        node.warn(RED._('hash.errors.validCertificate'));
        done();
      }
    });
  }
  RED.nodes.registerType('hash', hashCertificate);
};
