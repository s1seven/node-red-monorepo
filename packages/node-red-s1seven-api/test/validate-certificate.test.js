/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');

const container = require('./container');
const configNode = require('../lib/config/api-config');
const validateCertificateNode = require('../lib/certificates/validate-certificate');
const { axiosInstance } = require('./axios-helpers.mock');
const certificate = require('../fixtures/cert.json');

const fakeAccessToken = 'test';
const validateCertificateFlow = {
  id: 'n1',
  type: 'validate certificate',
  name: 'validate certificate',
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

describe('validate Node', function () {
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
    const flow = [validateCertificateFlow, configNodeFlow];
    await helper.load([validateCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    const n2 = helper.getNode('n2');
    expect(n1).toHaveProperty('name', 'validate certificate');
    expect(n2).toHaveProperty('name', 'api-config');
  });

  it('api should be called with the correct url and body', async () => {
    axiosInstance.post.mockResolvedValue({ data: { isValid: true } });
    const flow = [validateCertificateFlow, configNodeFlow];
    await helper.load([validateCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.receive({
      payload: certificate,
      accessToken: fakeAccessToken,
    });
    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/certificates/validate',
      certificate
    );
  });

  it('when no certificate is present, a warning will be shown', async () => {
    const flow = [validateCertificateFlow, configNodeFlow];
    await helper.load([validateCertificateNode, configNode], flow);
    const n1 = helper.getNode('n1');
    n1.error = jest.fn();
    n1.receive({ accessToken: fakeAccessToken });
    expect(n1.error).toHaveBeenCalledTimes(1);
    // expect(n1.error).toHaveBeenCalledWith(
    //     'Please add a valid JSON certificate to global.certificate or msg.payload'
    // );
    // node-test-helper does not resolve messages, adding the path as a fallback
    expect(n1.error).toHaveBeenCalledWith('validate.errors.validCertificate');
  });
});
