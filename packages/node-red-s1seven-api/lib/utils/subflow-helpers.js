/**
 * @typedef {object} SubflowEnv
 * @property {string} name
 * @property {string} type
 * @property {string} value
 **/

/**
 * @typedef {object} RawSubflowItem
 * @property {string} id
 * @property {string} type
 * @property {string} z
 * @property {string} [name]
 * @property {string} [func]
 * @property {number} [outputs]
 * @property {number} [noerr]
 * @property {string} [initialize]
 * @property {string} [finalize]
 * @property {Array<object>} [libs]
 * @property {number} x
 * @property {number} y
 * @property {Array<Array<string>>} wires
 * @property {[p:string]:any} [properties]
 */

/**
 * @typedef {object} ModuleSubflow
 * @property {string} id
 * @property {string} type
 * @property {string} name
 * @property {string} info
 * @property {string} category
 * @property {Array<object>} in
 * @property {Array<object>} out
 * @property {Array<SubflowEnv>} SubflowEnv
 * @property {object} meta
 * @property {string} meta.module
 * @property {string} meta.type
 * @property {string} meta.version
 * @property {string} meta.author
 * @property {string} meta.desc
 * @property {string} meta.license
 * @property {string} color
 * @property {string} icon
 * @property {object} status
 * @property {Array<RawSubflowItem>} flow
 * @property {Array<Array<string>>} wires
 * @property {[p:string]:any} [properties]
 *
 */

/**
 * Takes the raw subflow which is an array
 * and converts it to a module which is an object
 * @param {Array<RawSubflowItem>} json
 * @see https://nodered.org/docs/creating-nodes/subflow-modules
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
 * @example
 * const { writeFileSync } = require('fs');
 * const json = require('../mqtt/connect.json');
 * const subflow = moduleToSubflow(json);
 * console.log(subflow);
 * writeFileSync(`${__dirname}/../mqtt/connect.json`, JSON.stringify(subflow, null, 2));
 */
function moduleToSubflow(json) {
  console.log(json);
  const { flow, ...subflowNode } = json;
  return [subflowNode, ...flow];
}

const { writeFileSync } = require('fs');
const json = require('../mqtt/connect2.json');
// const subflow = moduleToSubflow(json);
const subflow = subflowToModule(json);

console.log(subflow);
writeFileSync(
  `${__dirname}/../mqtt/connect3.json`,
  JSON.stringify(subflow, null, 2)
);

module.exports = {
  subflowToModule,
  moduleToSubflow,
};
