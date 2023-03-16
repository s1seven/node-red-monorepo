/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');
const tokensNode = require('../lib/tokens/get-token.js');
const axios = require('axios');
const { URL_TO_ENV_MAP } = require('../resources/constants');
const fakeClientId = 'test';
const fakeClientSecret = 'test';

jest.mock('axios');

helper.init(require.resolve('node-red'));

describe('get access token by id Node', function () {
  beforeEach(function (done) {
    helper.startServer(done);
    helper.settings;
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    const flow = [
      { id: 'n1', type: 'get access token', name: 'get access token' },
    ];
    helper.load(tokensNode, flow, function () {
      const n1 = helper.getNode('n1');
      try {
        expect(n1).toHaveProperty('name', 'get access token');
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
        type: 'get access token',
        name: 'get access token',
        wires: [],
      },
    ];
    axios.post.mockResolvedValueOnce({
      data: {
        accessToken: 'fakeAccessToken',
        application: { mode: 'test' },
      },
    });

    helper.load(tokensNode, flow, function () {
      const n1 = helper.getNode('n1');

      n1.receive({
        clientId: fakeClientId,
        clientSecret: fakeClientSecret,
      });
      try {
        expect(axios.post).toHaveBeenCalledWith(
          `${URL_TO_ENV_MAP['production']}/api/tokens`,
          {
            clientId: fakeClientId,
            clientSecret: fakeClientSecret,
            headers: {
              'x-version': '1',
            },
          }
        );
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('when no clentId is present, a warning will be shown', function (done) {
    const flow = [
      {
        id: 'n1',
        type: 'get access token',
        name: 'get access token',
        wires: [['n2']],
      },
      { id: 'n2', type: 'helper' },
    ];
    helper.load(tokensNode, flow, function () {
      const n1 = helper.getNode('n1');
      const spy = jest.spyOn(n1, 'warn');
      n1.receive({ clientSecret: fakeClientSecret });
      try {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        // expect(spy).toHaveBeenCalledWith('Please add a clientId');
        // node-test-helper does not resolve messages, adding the path as a fallback
        expect(spy).toHaveBeenCalledWith('tokens.errors.clientId');
        spy.mockRestore();
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('when no clientSecret is present, a warning will be shown', function (done) {
    const flow = [
      {
        id: 'n1',
        type: 'get access token',
        name: 'get access token',
        wires: [['n2']],
      },
      { id: 'n2', type: 'helper' },
    ];

    helper.load(tokensNode, flow, function () {
      const n1 = helper.getNode('n1');
      const spy = jest.spyOn(n1, 'warn');
      n1.receive({
        clientId: fakeClientId,
      });
      try {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        // expect(spy).toHaveBeenCalledWith('Please add a clientSecret');
        // node-test-helper does not resolve messages, adding the path as a fallback
        expect(spy).toHaveBeenCalledWith('tokens.errors.clientSecret');
        spy.mockRestore();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
