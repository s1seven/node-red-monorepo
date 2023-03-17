const { asClass, createContainer, InjectionMode, Lifetime } = require('awilix');

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

function setupContainer() {
  container.register({
    axiosHelpers: asClass(require('./axios-helpers')),
    getters: asClass(require('./getters'), {
      lifetime: Lifetime.SINGLETON,
    }),
    asyncLocalStorage: asClass(require('./async-local-storage'), {
      lifetime: Lifetime.SINGLETON,
    }),
  });
  return container;
}

module.exports = {
  container,
  setupContainer,
};
