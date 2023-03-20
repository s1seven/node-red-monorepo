const { asClass, asValue, Lifetime } = require('awilix');

const { container } = require('../lib/utils/container');
const AsyncLocalStorageMock = require('./async-local-storage.mock');
const { createAxiosInstance, requestHandler } = require('./axios-helpers.mock');

function register() {
  container.register({
    getters: asClass(require('../lib/utils/getters'), {
      lifetime: Lifetime.SINGLETON,
    }),
    asyncLocalStorage: asClass(AsyncLocalStorageMock, {
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
