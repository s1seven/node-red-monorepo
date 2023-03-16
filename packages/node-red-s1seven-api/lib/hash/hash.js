'use strict';

module.exports = function (RED) {
  const path = require('node:path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

  const {
    setNewContext,
    exitContext,
  } = require('../utils/async-local-storage');
  const { createAxiosInstance } = require('../utils/axios');
  const { getAccessToken } = require('../utils/getters');
  const validateCertificate = require('../utils/validateCertificate');
  const requestHandler = require('../utils/requestHandler');
  const {
    ALGORITHM_OPTIONS,
    ENCODING_OPTIONS,
  } = require('../../resources/constants');

  function hashCertificate(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = this.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, cb) => {
      function done(err) {
        exitContext(cb, err);
      }
      setNewContext(apiConfig, msg);
      const accessToken = getAccessToken(globalContext);

      // request parameters
      const algorithm = msg.algorithm || config.algorithm || 'sha256';
      const encoding = msg.encoding || config.encoding || 'hex';

      if (!accessToken) {
        node.warn(RED._('hash.errors.accessToken'));
        done();
        return;
      }
      if (!ALGORITHM_OPTIONS.includes(algorithm)) {
        node.warn(RED._('hash.errors.algorithm'));
        done();
        return;
      }
      if (!ENCODING_OPTIONS.includes(encoding)) {
        node.warn(RED._('hash.errors.encoding'));
        done();
        return;
      }

      let certificate = msg.payload || globalContext.get('certificate');
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('hash.errors.validCertificate'));
        done(error);
        return;
      }

      const axios = createAxiosInstance(globalContext);

      const { success, data } = await requestHandler(
        axios.post(`/certificates/hash`, {
          algorithm,
          encoding,
          source: certificate,
        }),
        send
      );

      if (success) {
        done();
      } else {
        node.error(data);
        done(data);
      }
    });
  }
  RED.nodes.registerType('hash', hashCertificate);
};
