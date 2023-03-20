/* eslint-disable sonarjs/no-duplicate-string */
require('dotenv').config();
const helper = require('node-red-node-test-helper');

const container = require('./container');
const { axiosInstance } = require('./axios-helpers.mock');
const configNode = require('../lib/config/api-config');
const notarizeCertificateNode = require('../lib/certificates/notarize-certificate');
const certificate = require('../fixtures/cert.json');

const fakeAccessToken = 'test';
const fakeIdentity = 'test';
const fakeCompanyId = 'test';
const notarizeCertificateFlow = {
  id: 'n1',
  type: 'notarize certificate',
  name: 'notarize certificate',
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

describe('notarize Node', function () {
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
    const flow = [notarizeCertificateFlow, configNodeFlow];
    await helper.load([notarizeCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    const n2 = helper.getNode('n2');
    expect(n1).toHaveProperty('name', 'notarize certificate');
    expect(n2).toHaveProperty('name', 'api-config');
  });

  it('api should be called with the correct url and body', async () => {
    const flow = [notarizeCertificateFlow, configNodeFlow];
    axiosInstance.post.mockResolvedValue({ data: { value: 'hashValue' } });
    await helper.load([notarizeCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      payload: certificate,
      accessToken: fakeAccessToken,
      identity: fakeIdentity,
      companyId: fakeCompanyId,
    });
    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/certificates/notarize',
      certificate,
      {
        params: {
          identity: fakeIdentity,
          mode: 'test',
        },
      }
    );
  });

  it('when no accessToken is present, a warning will be shown', async () => {
    const flow = [notarizeCertificateFlow, configNodeFlow];
    await helper.load([notarizeCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({
      payload: certificate,
      identity: fakeIdentity,
      companyId: fakeCompanyId,
    });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    // expect(n1.warn).toHaveBeenCalledWith('Please add an access token');
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.warn).toHaveBeenCalledWith('notarize.errors.accessToken');
  });

  it('when no certificate is present, a warning will be shown', async () => {
    const flow = [notarizeCertificateFlow, configNodeFlow];
    await helper.load([notarizeCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.error = jest.fn();
    n1.receive({
      accessToken: fakeAccessToken,
      identity: fakeIdentity,
      companyId: fakeCompanyId,
    });
    expect(n1.error).toHaveBeenCalledTimes(1);
    // expect(n1.error).toHaveBeenCalledWith(
    //     'Please add a valid JSON certificate to global.certificate or msg.payload'
    // );
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.error).toHaveBeenCalledWith('notarize.errors.validCertificate'); // figure out why this doesn't resolve in testing
  });

  it('when no company id is present, a warning will be shown', async () => {
    const flow = [notarizeCertificateFlow, configNodeFlow];
    await helper.load([notarizeCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({
      accessToken: fakeAccessToken,
      payload: certificate,
      identity: fakeIdentity,
    });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    // expect(n1.warn).toHaveBeenCalledWith('Please add a company id');
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.warn).toHaveBeenCalledWith('notarize.errors.companyId');
  });

  it('when no identity is present, a warning will be shown', async () => {
    const flow = [notarizeCertificateFlow, configNodeFlow];
    await helper.load([notarizeCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.warn = jest.fn();
    n1.receive({
      accessToken: fakeAccessToken,
      payload: certificate,
      companyId: fakeCompanyId,
    });
    expect(n1.warn).toHaveBeenCalledTimes(1);
    // expect(n1.warn).toHaveBeenCalledWith('Please add an identity');
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.warn).toHaveBeenCalledWith('notarize.errors.identity');
  });
});
