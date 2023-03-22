/// <reference path="typedefs.js" />

const { format } = require('node:util');

const {
  GLOBAL_ACCESS_TOKEN_KEY_PATTERN,
  GLOBAL_BASE_URL_KEY_PATTERN,
  GLOBAL_COMPANY_ID_KEY_PATTERN,
  GLOBAL_MODE_KEY_PATTERN,
} = require('../../resources/constants');

/**
 * @description should return either the node name and if undefined the node id
 * @param {ApiConfig} configNode
 * @returns {string}
 */
function getConfigNodeIdentifier(configNode) {
  return configNode.name ? configNode.name.replaceAll(' ', '_') : configNode.id;
}

/**
 * @param {ApiConfig} configNode
 * @returns {string}
 */
const GLOBAL_ACCESS_TOKEN_KEY = (configNode) =>
  format(GLOBAL_ACCESS_TOKEN_KEY_PATTERN, getConfigNodeIdentifier(configNode));

/**
 * @param {ApiConfig} configNode
 * @returns {string}
 */
const GLOBAL_BASE_URL_KEY = (configNode) =>
  format(GLOBAL_BASE_URL_KEY_PATTERN, getConfigNodeIdentifier(configNode));

/**
 * @param {ApiConfig} configNode
 * @returns {string}
 */
const GLOBAL_COMPANY_ID_KEY = (configNode) =>
  format(GLOBAL_COMPANY_ID_KEY_PATTERN, getConfigNodeIdentifier(configNode));

/**
 * @param {ApiConfig} configNode
 * @returns {string}
 */
const GLOBAL_MODE_KEY = (configNode) =>
  format(GLOBAL_MODE_KEY_PATTERN, getConfigNodeIdentifier(configNode));

module.exports = {
  GLOBAL_ACCESS_TOKEN_KEY,
  GLOBAL_BASE_URL_KEY,
  GLOBAL_COMPANY_ID_KEY,
  GLOBAL_MODE_KEY,
};
