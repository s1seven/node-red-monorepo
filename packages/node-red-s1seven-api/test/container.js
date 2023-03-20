const { asClass, asValue, Lifetime } = require('awilix');

const { container } = require('../lib/utils/container');
const { createAxiosInstance, requestHandler } = require('./axios-helpers');

function register() {
  container.register({
    getters: asClass(require('../lib/utils/getters'), {
      lifetime: Lifetime.SINGLETON,
    }),
    asyncLocalStorage: asClass(require('../lib/utils/async-local-storage'), {
      lifetime: Lifetime.SINGLETON,
    }),
    axiosHelpers: asValue({
      createAxiosInstance,
      requestHandler,
    }),
  });
}

function dispose() {
  return container.dispose();
}

module.exports = {
  container,
  dispose,
  register,
};
