/**
 * @namespace subflow-helpers
 */

/**
 * Takes the raw subflow which is an array
 * and converts it to a module which is an object
 * @param {Array<RawSubflowItem>} json
 * @see https://nodered.org/docs/creating-nodes/subflow-modules
 * @memberof subflow-helpers
 * @example
 * const { writeFileSync } = require('fs');
 * const json = require('../mqtt/connect.json');
 * const subflow = subflowToModule(json);
 * console.log(subflow);
 * writeFileSync(`${__dirname}/../mqtt/connect.json`, JSON.stringify(subflow, null, 2));
 */
function subflowToModule(json) {
  const subflowNode = json.shift();
  return {
    ...subflowNode,
    flow: json,
  };
}

/**
 * Takes the modularized subflow which is an object including the flow property,
 * and converts it to a raw subflow which is an object
 * @param {ModuleSubflow} json
 * @see https://nodered.org/docs/creating-nodes/subflow-modules
 * @returns {Array<RawSubflowItem>}
 * @memberof subflow-helpers
 * @example
 * const { writeFileSync } = require('fs');
 * const json = require('../mqtt/connect.json');
 * const subflow = moduleToSubflow(json);
 * console.log(subflow);
 * writeFileSync(`${__dirname}/../mqtt/connect.json`, JSON.stringify(subflow, null, 2));
 */
function moduleToSubflow(json) {
  const { flow, ...subflowNode } = json;
  return [subflowNode, ...flow];
}

// const { writeFileSync } = require('fs');
// const json = require('../mqtt/connect.json');
// const subflow = moduleToSubflow(json);
// // const subflow = subflowToModule(json);
// // console.log(subflow);
// writeFileSync(
//   `${__dirname}/../mqtt/connect-flow.json`,
//   JSON.stringify(subflow, null, 2)
// );

module.exports = {
  subflowToModule,
  moduleToSubflow,
};
