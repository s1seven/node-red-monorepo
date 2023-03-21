/// <reference path="typedefs.js" />

const { container } = require('./container');

/**
 * JS black magic to make sure that the asyncLocalStorage is initialized and exited correctly
 * @param {NodeRedNode} apiConfig
 */
function onInputFactory(apiConfig) {
  /** @type {import('./async-local-storage')} */
  const asyncLocalStorage = container.resolve('asyncLocalStorage');
  /**
   * @param {NodeMessage} msg
   * @param {NodeRedSend} send
   * @param {Done} cb
   * @this {import('./super-node')}
   */
  return function onInput(msg, send, cb) {
    const globalContext = this.context().global;
    function done(err) {
      asyncLocalStorage.exit(cb, err);
    }
    asyncLocalStorage.init({ apiConfig, globalContext, msg });
    this.emit('msg', msg, send, done);
  };
}

module.exports = {
  onInputFactory,
};
