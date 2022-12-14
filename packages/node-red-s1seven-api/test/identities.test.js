/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');
const identitiesNode = require('../lib/identities/identities.js');
const axios = require('axios');
const { URL_TO_ENV_MAP } = require('../resources/constants');
const fakeAccessToken = 'test';
const fakeCompanyId = 'test';

jest.mock('axios');

helper.init(require.resolve('node-red'));

describe('get identities Node', function () {
  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    const flow = [{ id: 'n1', type: 'get identities', name: 'get identities' }];
    helper.load(identitiesNode, flow, function () {
      const n1 = helper.getNode('n1');
      try {
        expect(n1).toHaveProperty('name', 'get identities');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('api should be called with the correct url and body', function (done) {
    const flow = [
      { id: 'n1', type: 'get identities', name: 'get identities', wires: [] },
    ];
    axios.get.mockResolvedValue({});

    helper.load(identitiesNode, flow, function () {
      const n1 = helper.getNode('n1');
      n1.receive({
        accessToken: fakeAccessToken,
        companyId: fakeCompanyId,
      });
      try {
        expect(axios.get).toHaveBeenCalledWith(
          `${URL_TO_ENV_MAP['production']}/api/identities`,
          {
            headers: {
              Authorization: `Bearer ${fakeAccessToken}`,
              'Content-Type': 'application/json',
              company: fakeCompanyId,
            },
            params: {
              coinType: null,
              status: null,
              account: null,
              index: null,
              mode: 'test',
            },
          }
        );
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('coin type and status can be set via the ui', function (done) {
    const coinType = 822;
    const status = 'live';
    const flow = [
      {
        id: 'n1',
        type: 'get identities',
        name: 'get identities',
        wires: [],
        status: status,
        coinType: coinType,
      },
    ];
    axios.get.mockResolvedValue({});

    helper.load(identitiesNode, flow, function () {
      const n1 = helper.getNode('n1');
      n1.receive({
        accessToken: fakeAccessToken,
        companyId: fakeCompanyId,
      });
      try {
        expect(axios.get).toHaveBeenCalledWith(
          `${URL_TO_ENV_MAP['production']}/api/identities`,
          {
            headers: {
              Authorization: `Bearer ${fakeAccessToken}`,
              'Content-Type': 'application/json',
              company: fakeCompanyId,
            },
            params: {
              coinType,
              status,
              account: null,
              index: null,
              mode: 'test',
            },
          }
        );
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('coin type and status can be set via the ui', function (done) {
    const BIP44Account = 1;
    const BIP44Index = 1;
    const flow = [
      {
        id: 'n1',
        type: 'get identities',
        name: 'get identities',
        wires: [],
        BIP44Account: BIP44Account,
        BIP44Index: BIP44Index,
      },
    ];
    axios.get.mockResolvedValue({});

    helper.load(identitiesNode, flow, function () {
      const n1 = helper.getNode('n1');
      n1.receive({
        accessToken: fakeAccessToken,
        companyId: fakeCompanyId,
      });
      try {
        expect(axios.get).toHaveBeenCalledWith(
          `${URL_TO_ENV_MAP['production']}/api/identities`,
          {
            headers: {
              Authorization: `Bearer ${fakeAccessToken}`,
              'Content-Type': 'application/json',
              company: fakeCompanyId,
            },
            params: {
              coinType: null,
              status: null,
              account: BIP44Account,
              index: BIP44Index,
              mode: 'test',
            },
          }
        );
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('when no accessToken is present, a warning will be shown', function (done) {
    const flow = [
      {
        id: 'n1',
        type: 'get identities',
        name: 'get identities',
        wires: [['n2']],
      },
      { id: 'n2', type: 'helper' },
    ];
    helper.load(identitiesNode, flow, function () {
      const n1 = helper.getNode('n1');
      const spy = jest.spyOn(n1, 'warn');
      n1.receive({ companyId: fakeCompanyId });
      try {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        // expect(spy).toHaveBeenCalledWith('Please add an access token');
        // node-test-helper does not resolve messages, adding the path as a fallback
        expect(spy).toHaveBeenCalledWith('identity.errors.accessToken');
        done();
      } catch (error) {
        done(error);
      }
      spy.mockRestore();
    });
  });

  it('when no companyId is present, a warning will be shown', function (done) {
    const flow = [
      {
        id: 'n1',
        type: 'get identities',
        name: 'get identities',
        wires: [['n2']],
      },
      { id: 'n2', type: 'helper' },
    ];

    helper.load(identitiesNode, flow, function () {
      const n1 = helper.getNode('n1');
      const spy = jest.spyOn(n1, 'warn');
      n1.receive({
        accessToken: fakeAccessToken,
      });
      try {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        // expect(spy).toHaveBeenCalledWith('Please add a company id');
        // node-test-helper does not resolve messages, adding the path as a fallback
        expect(spy).toHaveBeenCalledWith('identity.errors.companyId');
        done();
      } catch (error) {
        done(error);
      }
      spy.mockRestore();
    });
  });
});
