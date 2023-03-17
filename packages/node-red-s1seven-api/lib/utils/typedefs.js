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
 * @typedef {function} Send
 * @param {NodeMessage | NodeMessage[]} messages
 * @returns {void}
 * @throws {Error}
 *  @memberof typdefs
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
 * @property {string} clientId
 * @property {string} clientSecret
 * @property {ApiEnvironment} environment
 * @property {string} clientSecret
 * @memberof typdefs
 */

/**
 * @typedef {import('node-red').NodeContext['global']} GlobalContext
 * @memberof typdefs
 */
