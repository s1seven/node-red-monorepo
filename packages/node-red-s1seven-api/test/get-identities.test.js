/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');

const configNode = require('../lib/config/api-config.js');
const getIdentitiesNode = require('../lib/identities/get-identities');
const { axiosInstance } = require('./axios-helpers.mock');
const container = require('./container');

const fakeAccessToken = 'test';
const fakeCompanyId = 'test';
const getIdentitiesFlow = {
  id: 'n1',
  type: 'get identities',
  name: 'get identities',
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

describe('get identities Node', function () {
  beforeEach(function (done) {
    container.register();
    helper.startServer(done);
  });

  afterEach(function (done) {
    container.dispose().finally(() => {
      helper.unload();
      helper.stopServer(done);
    });
  });

  it('should be loaded', async () => {
    const flow = [getIdentitiesFlow, configNodeFlow];
    await helper.load([getIdentitiesNode, configNode], flow);
    const n1 = helper.getNode('n1');
    const n2 = helper.getNode('n2');
    expect(n1).toHaveProperty('name', 'get identities');
    expect(n2).toHaveProperty('name', 'api-config');
  });

  it('api should be called with the correct url and body', async () => {
    const flow = [getIdentitiesFlow, configNodeFlow];
    axiosInstance.get.mockResolvedValue({});
    await helper.load([getIdentitiesNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      accessToken: fakeAccessToken,
      companyId: fakeCompanyId,
    });
    expect(axiosInstance.get).toHaveBeenCalledWith('/identities', {
      params: {
        coinType: null,
        status: null,
        account: null,
        index: null,
        mode: 'test',
      },
    });
  });

  it('coin type and status can be set via the ui', async () => {
    const coinType = 822;
    const status = 'live';
    const flow = [{ ...getIdentitiesFlow, status, coinType }, configNodeFlow];
    axiosInstance.get.mockResolvedValue({});
    await helper.load([getIdentitiesNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      accessToken: fakeAccessToken,
      companyId: fakeCompanyId,
    });
    expect(axiosInstance.get).toHaveBeenCalledWith('/identities', {
      params: {
        coinType,
        status,
        account: null,
        index: null,
        mode: 'test',
      },
    });
  });

  it('account and index can be set via the ui', async () => {
    const BIP44Account = 1;
    const BIP44Index = 1;
    const flow = [
      { ...getIdentitiesFlow, BIP44Account, BIP44Index },
      configNodeFlow,
    ];
    axiosInstance.get.mockResolvedValue({});
    await helper.load([getIdentitiesNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      accessToken: fakeAccessToken,
      companyId: fakeCompanyId,
    });
    expect(axiosInstance.get).toHaveBeenCalledWith('/identities', {
      params: {
        coinType: null,
        status: null,
        account: BIP44Account,
        index: BIP44Index,
        mode: 'test',
      },
    });
  });

  it('when no accessToken is present, a warning will be shown', async () => {
    const flow = [getIdentitiesFlow, configNodeFlow];
    await helper.load([getIdentitiesNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({ companyId: fakeCompanyId });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    // expect(n1.warn).toHaveBeenCalledWith('Please add an access token');
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.warn).toHaveBeenCalledWith('identities.errors.accessToken');
  });

  it('when no companyId is present, a warning will be shown', async () => {
    const flow = [getIdentitiesFlow, configNodeFlow];
    await helper.load([getIdentitiesNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({
      accessToken: fakeAccessToken,
    });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    // expect(n1.warn).toHaveBeenCalledWith('Please add a company id');
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.warn).toHaveBeenCalledWith('identities.errors.companyId');
  });
});
