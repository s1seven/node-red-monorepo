/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');
const configNode = require('../lib/config/api-config.js');

helper.init(require.resolve('node-red'));

describe('config Node', function () {
  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', async () => {
    const credentials = {
      clientId: { type: 'text' },
      clientSecret: { type: 'password' },
    };
    const flow = [
      {
        id: 'n1',
        type: 'api-config',
        name: 'api-config',
        apiVersion: 1,
        environment: 'production',
        // ? investigate how to pass credentials
        // credentials: {
        //   clientId: 'test',
        //   clientSecret: 'test',
        // },
      },
    ];

    await helper.load(configNode, flow, credentials);
    const n1 = helper.getNode('n1');
    expect(n1).toHaveProperty('name', 'api-config');
    expect(n1).toHaveProperty('credentials');
    expect(n1).toHaveProperty('environment', 'production');
    expect(n1).toHaveProperty('apiVersion', 1);
  });
});
