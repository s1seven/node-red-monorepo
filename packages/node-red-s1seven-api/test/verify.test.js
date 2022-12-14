/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');
const verifyNode = require('../lib/verify/verify.js');
const certificate = require('../fixtures/cert.json');
const axios = require('axios');
const { URL_TO_ENV_MAP } = require('../resources/constants');
const fakeAccessToken = 'test';

jest.mock('axios');

helper.init(require.resolve('node-red'));

describe('verify Node', function () {
  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    const flow = [
      {
        id: 'n1',
        type: 'verify certificate',
        name: 'verify certificate',
      },
    ];

    helper.load(verifyNode, flow, function () {
      const n1 = helper.getNode('n1');
      try {
        expect(n1).toHaveProperty('name', 'verify certificate');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('api should be called with the correct url and body', function (done) {
    const flow = [
      {
        id: 'n1',
        type: 'verify certificate',
        name: 'verify certificate',
      },
      { id: 'n2', type: 'helper' },
    ];
    axios.post.mockResolvedValue({ data: { isValid: true } });

    helper.load(verifyNode, flow, function () {
      const n1 = helper.getNode('n1');
      n1.receive({
        payload: certificate,
        accessToken: fakeAccessToken,
      });
      try {
        expect(axios.post).toHaveBeenCalledWith(
          `${URL_TO_ENV_MAP['production']}/api/certificates/verify/?mode=test`,
          certificate,
          {
            headers: {
              'Content-Type': 'application/json',
              Authentication: 'bearer test',
            },
          }
        );
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('authentication header should not be present if access token is not present', function (done) {
    const flow = [
      {
        id: 'n1',
        type: 'verify certificate',
        name: 'verify certificate',
      },
      { id: 'n2', type: 'helper' },
    ];
    axios.post.mockResolvedValue({ data: { isValid: true } });

    helper.load(verifyNode, flow, function () {
      const n1 = helper.getNode('n1');
      n1.receive({
        payload: certificate,
      });
      try {
        expect(axios.post).toHaveBeenCalledWith(
          `${URL_TO_ENV_MAP['production']}/api/certificates/verify/?mode=test`,
          certificate,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('when no certificate is present, a warning will be shown', function (done) {
    const flow = [
      {
        id: 'n1',
        type: 'verify certificate',
        name: 'verify certificate',
      },
      { id: 'n2', type: 'helper' },
    ];

    helper.load(verifyNode, flow, function () {
      const n1 = helper.getNode('n1');
      const spy = jest.spyOn(n1, 'warn');
      n1.receive({ accessToken: fakeAccessToken });
      try {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        // expect(spy).toHaveBeenCalledWith(
        //     'Please add a valid JSON certificate to global.certificate or msg.payload'
        // );
        // node-test-helper does not resolve messages, adding the path as a fallback
        expect(spy).toHaveBeenCalledWith('verify.errors.validCertificate');
        done();
      } catch (error) {
        done(error);
      }
      spy.mockRestore();
    });
  });
});
