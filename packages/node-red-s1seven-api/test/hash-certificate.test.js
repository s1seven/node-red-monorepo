/* eslint-disable sonarjs/no-duplicate-string */
const { asClass, asValue, Lifetime } = require('awilix');
const helper = require('node-red-node-test-helper');

const configNode = require('../lib/config/api-config.js');
const hash = require('../lib/certificates/hash-certificate');
const { container } = require('../lib/utils/container');
const {
  axiosInstance,
  createAxiosInstance,
  requestHandler,
} = require('./axios-helpers');
const certificate = require('../fixtures/cert.json');

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

helper.init(require.resolve('node-red'));

const fakeAccessToken = 'test';
const configNodeFlow = {
  id: 'n2',
  type: 'api-config',
  name: 'api-config',
  apiVersion: 1,
  environment: 'production',
};

describe('hash certificate Node', function () {
  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', async () => {
    const flow = [
      { id: 'n1', type: 'hash', name: 'hash', apiConfig: 'n2' },
      configNodeFlow,
    ];
    //
    await helper.load([hash, configNode], flow);
    const n1 = helper.getNode('n1');
    const n2 = helper.getNode('n2');
    expect(n1).toHaveProperty('name', 'hash');
    expect(n2).toHaveProperty('name', 'api-config');
  });

  it('api should be called with the correct url and body', async () => {
    const flow = [
      { id: 'n1', type: 'hash', name: 'hash', apiConfig: 'n2', wires: [] },
      configNodeFlow,
    ];
    axiosInstance.post = jest
      .fn()
      .mockResolvedValueOnce({ data: { value: 'hashValue' } });
    //
    await helper.load([hash, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      payload: certificate,
      accessToken: fakeAccessToken,
    });
    expect(axiosInstance.post).toHaveBeenCalledWith('/certificates/hash', {
      algorithm: 'sha256',
      encoding: 'hex',
      source: certificate,
    });
  });

  it('algorithm and encoding can be overridden via the msg object', async () => {
    const flow = [
      { id: 'n1', type: 'hash', name: 'hash', wires: [], apiConfig: 'n2' },
      configNodeFlow,
    ];
    axiosInstance.post = jest
      .fn()
      .mockResolvedValueOnce({ data: { value: 'hashValue' } });
    const algorithm = 'sha512';
    const encoding = 'base64';
    //
    await helper.load([hash, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      payload: certificate,
      accessToken: fakeAccessToken,
      algorithm,
      encoding,
    });
    expect(axiosInstance.post).toHaveBeenCalledWith('/certificates/hash', {
      algorithm,
      encoding,
      source: certificate,
    });
  });

  it('algorithm and encoding can be set via the ui', async () => {
    const algorithm = 'sha3-256';
    const encoding = 'base64';
    const flow = [
      {
        id: 'n1',
        type: 'hash',
        name: 'hash',
        wires: [],
        algorithm,
        encoding,
        apiConfig: 'n2',
      },
      configNodeFlow,
    ];
    axiosInstance.post = jest
      .fn()
      .mockResolvedValueOnce({ data: { value: 'hashValue' } });
    //
    await helper.load([hash, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      payload: certificate,
      accessToken: fakeAccessToken,
    });
    expect(axiosInstance.post).toHaveBeenCalledWith('/certificates/hash', {
      algorithm,
      encoding,
      source: certificate,
    });
  });

  it('when no accessToken is present, a warning will be shown', async () => {
    const flow = [
      {
        id: 'n1',
        type: 'hash',
        name: 'hash',
        wires: [],
        apiConfig: 'n2',
      },
      configNodeFlow,
    ];
    //
    await helper.load([hash, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({ payload: {} });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    expect(n1.warn).toHaveBeenCalledWith('hash.errors.accessToken');
    // expect(n1.warn).toHaveBeenCalledWith('Please add an access token'); // this does not resolve, hash.errors.accessToken
  });

  it('when no certificate is present, an error will be shown', async () => {
    const flow = [
      {
        id: 'n1',
        type: 'hash',
        name: 'hash',
        wires: [],
        apiConfig: 'n2',
      },
      configNodeFlow,
    ];
    //
    await helper.load([hash, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.error = jest.fn();
    n1.context().global.set('certificate', null);
    n1.receive({ accessToken: fakeAccessToken });
    expect(n1.error).toHaveBeenCalledTimes(1);
    // expect(n1.error).toHaveBeenCalledWith(
    //     'Please add a valid JSON certificate to global.certificate or msg.payload'
    // );
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.error).toHaveBeenCalledWith('hash.errors.validCertificate');
  });
});
