'use strict';

module.exports = function (RED) {
  const path = require('node:path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

  const {
    exitContext,
    setNewContext,
  } = require('../utils/async-local-storage');
  const { createAxiosInstance } = require('../utils/axios');
  const {
    getApiMode,
    getAccessToken,
    getCurrentCompanyId,
  } = require('../utils/getters');
  const requestHandler = require('../utils/requestHandler');
  const validateCertificate = require('../utils/validateCertificate');

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function notarizeCertificate(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const globalContext = this.context().global;
    const apiConfig = RED.nodes.getNode(config.apiConfig);

    node.on('input', async (msg, send, cb) => {
      function done(err) {
        exitContext(cb, err);
      }
      setNewContext(apiConfig, msg);

      const companyId = getCurrentCompanyId(globalContext);
      const accessToken = getAccessToken(globalContext);
      const mode = getApiMode(globalContext);

      // request parameters
      const identity =
        msg.identity || config.identity || globalContext.get('identity');
      if (!accessToken) {
        node.warn(RED._('notarize.errors.accessToken'));
        done();
        return;
      }
      if (!companyId) {
        node.warn(RED._('notarize.errors.companyId'));
        done();
        return;
      }
      if (!identity) {
        node.warn(RED._('notarize.errors.identity'));
        done();
        return;
      }

      let certificate = msg.payload || globalContext.get('certificate');
      try {
        certificate = validateCertificate(certificate);
      } catch (error) {
        node.error(RED._('notarize.errors.validCertificate'));
        done(error);
        return;
      }

      const axios = createAxiosInstance(globalContext);
      const { success, data } = await requestHandler(
        axios.post('/certificates/notarize', certificate, {
          params: {
            identity,
            mode,
          },
        }),
        send
      );

      if (success) {
        done();
      } else {
        // node.error(data);
        done(data);
      }
    });
  }
  RED.nodes.registerType('notarize certificate', notarizeCertificate);
};
