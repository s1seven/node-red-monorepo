const axios = require('axios');
const { hostname } = require('node:os');
const {
  getAccessToken,
  getApiUrl,
  getApiVersion,
  getCurrentCompanyId,
} = require('./getters');
const { pkgVersion } = require('../../package.json');
/**
 *
 * @param {import('node-red').NodeContext['global']} globalContext
 * @returns {import('axios').AxiosInstance}
 */
function createAxiosInstance(globalContext) {
  const version = getApiVersion();
  const accessToken = getAccessToken(globalContext);
  const companyId = getCurrentCompanyId(globalContext);

  return axios.create({
    baseURL: getApiUrl(),
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authentication: `bearer ${accessToken}` } : {}),
      ...(companyId ? { company: companyId } : {}),
      'x-version': `${version}`,
      'user-agent': `node-red-s1seven-api/${pkgVersion}/${hostname}`,
    },
    validateStatus: (status) => status >= 200 && status < 300,
    responseType: 'json',
  });
}

module.exports = {
  createAxiosInstance,
};
