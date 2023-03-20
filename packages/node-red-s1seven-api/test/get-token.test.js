/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');

const configNode = require('../lib/config/api-config');
const getTokenNode = require('../lib/tokens/get-token');
const { axiosInstance } = require('./axios-helpers.mock');
const container = require('./container');

const fakeClientId = 'test';
const fakeClientSecret = 'test';
const getTokenFlow = {
  id: 'n1',
  type: 'get access token',
  name: 'get access token',
  apiConfig: 'n2',
  wires: [],
};
const configNodeFlow = {
  id: 'n2',
  type: 'api-config',
  name: 'api-config',
  apiVersion: 1,
  environment: 'production',
};

helper.init(require.resolve('node-red'));

describe('get access token Node', function () {
  beforeEach(function (done) {
    container.register();
    helper.startServer(done);
    helper.settings;
  });

  afterEach(function (done) {
    container.dispose().finally(() => {
      helper.unload();
      helper.stopServer(done);
    });
  });

  it('should be loaded', async () => {
    const flow = [getTokenFlow, configNodeFlow];
    await helper.load([getTokenNode, configNode], flow);
    const n1 = helper.getNode('n1');
    const n2 = helper.getNode('n2');
    expect(n1).toHaveProperty('name', 'get access token');
    expect(n2).toHaveProperty('name', 'api-config');
  });

  it('api should be called with the correct url and body', async () => {
    const flow = [getTokenFlow, configNodeFlow];
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        accessToken: 'fakeAccessToken',
        application: { mode: 'test', owner: { id: 'companyId' } },
      },
    });

    await helper.load([getTokenNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      clientId: fakeClientId,
      clientSecret: fakeClientSecret,
    });
    expect(axiosInstance.post).toHaveBeenCalledWith('/tokens', {
      clientId: fakeClientId,
      clientSecret: fakeClientSecret,
    });
  });

  it('when no clentId is present, a warning will be shown', async () => {
    const flow = [getTokenFlow, configNodeFlow];
    await helper.load([getTokenNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({ clientSecret: fakeClientSecret });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    // expect(n1.warn).toHaveBeenCalledWith('Please add a clientId');
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.warn).toHaveBeenCalledWith('tokens.errors.clientId');
  });

  it('when no clientSecret is present, a warning will be shown', async () => {
    const flow = [getTokenFlow, configNodeFlow];
    await helper.load([getTokenNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({
      clientId: fakeClientId,
    });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    // expect(n1.warn).toHaveBeenCalledWith('Please add a clientSecret');
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.warn).toHaveBeenCalledWith('tokens.errors.clientSecret');
  });
});
