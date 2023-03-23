/**
 * @namespace typedefs
 */

/**
 * @typedef {object} NodeMessage
 * @property {unknown} payload
 * @property {string} topic
 * @property {string} _msgid
 * @memberof typedefs
 */

/**
 * @typedef { (msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>) => void } NodeRedSend
 * @returns {void}
 * @throws {Error}
 * @memberof typedefs
 */

/**
 * @typedef { (e: Error | undefined) => void } Done
 * @returns {void}
 * @memberof typedefs
 * */

/**
 * @typedef { (msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>, send: NodeRedSend, cd: Done) => void } NodeInputHandler
 * @returns {void}
 * @memberof typedefs
 */

/**
 * @typedef {'staging' | 'production'} ApiEnvironment
 * @memberof typedefs
 */

/**
 * @typedef {'test' | 'live'} ApiMode
 * @memberof typedefs
 */

/**
 * @typedef {object} ApiConfig
 * @property {string|undefined} name
 * @property {string} id
 * @property {number|string} apiVersion
 * @property {object} credentials
 * @property {string} credentials.clientId
 * @property {string} credentials.clientSecret
 * @property {ApiEnvironment} environment
 * @property {string} baseUrl
 * @memberof typedefs
 */

/**
 * @typedef {import('node-red').NodeContext['global']} GlobalContext
 * @memberof typedefs
 */

/**
 * @typedef {import('node-red').NodeRedNode} GlobalContext
 * @memberof typedefs
 */

/**
 * @typedef {import('node-red').NodeInitializer} RED_JS
 * @memberof typedefs
 */

/**
 * @typedef {import('@node-red/registry').Node} NodeRedNode
 * @memberof typedefs
 */

/**
 * @typedef {import('node-red').EditorRED} RED_HTML
 * @memberof typedefs
 */

/**
 * @typedef {object} SubflowEnv
 * @property {string} name
 * @property {string} type
 * @property {string} value
 * @memberof typedefs
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
 * @memberof typedefs
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
 * @memberof typedefs
 */
