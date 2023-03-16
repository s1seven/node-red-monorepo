'use strict';

module.exports = function (RED) {
  const path = require('node:path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

  const {
    setNewContext,
    exitContext,
  } = require('../utils/async-local-storage');
  const { createAxiosInstance } = require('../utils/axios');
  const { getAccessToken, getCurrentCompanyId } = require('../utils/getters');
  const requestHandler = require('../utils/requestHandler');

  function getCompany(config) {
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
      if (!accessToken) {
        node.warn(RED._('company.errors.accessToken'));
        done();
        return;
      }
      if (!companyId) {
        node.warn(RED._('company.errors.companyId'));
        done();
        return;
      }

      const axios = createAxiosInstance(globalContext);
      console.log(axios);
      const { success, data } = await requestHandler(
        axios.get(`/companies/${companyId}`),
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
  RED.nodes.registerType('get company', getCompany);
};
