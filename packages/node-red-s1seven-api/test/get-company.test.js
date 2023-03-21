/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');

const configNode = require('../lib/config/api-config');
const getCompanyNode = require('../lib/companies/get-company');
const { axiosInstance } = require('./axios-helpers.mock');
const container = require('./container');

helper.init(require.resolve('node-red'));

const fakeAccessToken = 'test';
const fakeCompanyId = 'test';
const getCompanyFlow = {
  id: 'n1',
  type: 'get company',
  name: 'get company',
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

describe('get company Node', function () {
  beforeEach(function (done) {
    container.register();
    helper.startServer(done);
    // helper.settings; // TODO: take a look at what is expected
  });

  afterEach(function (done) {
    container.dispose().finally(() => {
      helper.unload();
      helper.stopServer(done);
    });
  });

  it('should be loaded', async () => {
    const flow = [getCompanyFlow, configNodeFlow];
    await helper.load([getCompanyNode, configNode], flow);
    const n1 = helper.getNode('n1');
    expect(n1).toHaveProperty('name', 'get company');
  });

  it('api should be called with the correct url and body', async () => {
    const flow = [getCompanyFlow, configNodeFlow];
    axiosInstance.get = jest.fn().mockResolvedValueOnce({ data: {} });
    await helper.load([getCompanyNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      accessToken: fakeAccessToken,
      companyId: fakeCompanyId,
    });
    expect(axiosInstance.get).toHaveBeenCalledWith(
      `/companies/${fakeCompanyId}`
    );
  });

  it('when no accessToken is present, a warning will be shown', async () => {
    const flow = [getCompanyFlow, configNodeFlow];
    await helper.load([getCompanyNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    expect(n1.warn).not.toHaveBeenCalled();
    n1.receive({ companyId: fakeCompanyId });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    expect(n1.warn).toHaveBeenCalledWith('company.errors.accessToken');
    // expect(spy).toHaveBeenCalledWith('Please add an access token');
    // node-test-helper does not resolve messages, adding the path as a fallback
  });

  it('when no companyId is present, a warning will be shown', async () => {
    const flow = [getCompanyFlow, configNodeFlow];
    await helper.load([getCompanyNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({
      accessToken: fakeAccessToken,
    });
    // expect(n1.warn).toHaveBeenCalledWith('Please add a company id');
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.warn).toHaveBeenCalledWith('company.errors.companyId');
  });
});
