/* eslint-disable sonarjs/no-duplicate-string */
const helper = require('node-red-node-test-helper');
const generateChartNode = require('../chartjs.js');

helper.init(require.resolve('node-red'));

describe('generate chart Node', function () {
  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    const flow = [{ id: 'n1', type: 'generate chart', name: 'generate chart' }];
    helper.load(generateChartNode, flow, function () {
      const n1 = helper.getNode('n1');
      try {
        expect(n1.name).toBe('generate chart');
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
