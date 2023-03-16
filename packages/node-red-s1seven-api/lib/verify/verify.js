'use strict';

module.exports = function (RED) {
  const path = require('node:path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

  const {
    setNewContext,
    exitContext,
  } = require('../utils/async-local-storage');
  const { createAxiosInstance } = require('../utils/axios');
  const { getApiMode } = require('../utils/getters');
  const requestHandler = require('../utils/requestHandler');
  const validateCertificate = require('../utils/validateCertificate');

  function verifyCertificate(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = this.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, cb) => {
      function done(err) {
        exitContext(cb, err);
      }
      setNewContext(apiConfig, msg);
      const mode = getApiMode(globalContext);

      let certificate = msg.payload || globalContext.get('certificate');
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('verify.errors.validCertificate'));
        done(error);
        return;
      }

      const axios = createAxiosInstance(globalContext);
      const { success, data } = await requestHandler(
        axios.post('/certificates/verify', certificate, {
          params: { mode },
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
  RED.nodes.registerType('verify certificate', verifyCertificate);
};
