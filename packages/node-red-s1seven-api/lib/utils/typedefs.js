/**
 * @namespace typedefs
 */

/**
 * @typedef {object} NodeMessage
 * @property {unknown} payload
 * @property {string} topic
 * @property {string} _msgid
 * @memberof typdefs
 */

/**
 * @typedef { (msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>) => void } NodeRedSend
 * @returns {void}
 * @throws {Error}
 * @memberof typdefs
 */

/**
 * @typedef { (e: Error | undefined) => void } Done
 * @returns {void}
 * @memberof typdefs
 * */

/**
 * @typedef { (msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>, send: NodeRedSend, cd: Done) => void } NodeInputHandler
 * @returns {void}
 * @memberof typdefs
 */

/**
 * @typedef {'staging' | 'production'} ApiEnvironment
 * @memberof typdefs
 */

/**
 * @typedef {'test' | 'live'} ApiMode
 * @memberof typdefs
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
 * @memberof typdefs
 */

/**
 * @typedef {import('node-red').NodeContext['global']} GlobalContext
 * @memberof typdefs
 */

/**
 * @typedef {import('node-red').NodeRedNode} GlobalContext
 * @memberof typdefs
 */

/**
 * @typedef {import('node-red').NodeInitializer} RED_JS
 * @memberof typdefs
 */

/**
 * @typedef {import('@node-red/registry').Node} NodeRedNode
 * @memberof typdefs
 */

/**
 * @typedef {import('node-red').EditorRED} RED_HTML
 * @memberof typdefs
 */
