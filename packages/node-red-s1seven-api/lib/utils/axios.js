const { Axios } = require('axios');
const { getAccessToken, getApiUrl, getCurrentCompanyId } = require('./getters');

/**
 *
 * @returns {import('axios').AxiosInstance}
 */
function axios() {
  const version = getApiVersion();
  const accessToken = getAccessToken();
  const companyId = getCurrentCompanyId();

  return new Axios({
    baseURL: getApiUrl(),
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authentication: `bearer ${accessToken}` } : {}),
      ...(companyId ? { company: companyId } : {}),
      'x-version': `${version}`,
    },
  });
}

module.exports = axios;
