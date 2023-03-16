const { format } = require('util');

const URL_TO_ENV_MAP = {
  staging: 'https://app.s1seven.dev',
  production: 'https://app.s1seven.com',
};
const ALGORITHM_OPTIONS = [
  'sha256',
  'sha512',
  'sha3-256',
  'sha3-384',
  'sha3-512',
];
const ENCODING_OPTIONS = ['base64', 'hex'];
const MODE = ['test', 'live'];
const ACCOUNT_INDEX_MIN = 0;
const ACCOUNT_INDEX_MAX = 2147483647;

// API client default parameters
const DEFAULT_API_VERSION = 1;
const DEFAULT_API_ENVIRONMENT = 'production';
const DEFAULT_API_MODE = 'test';

// node rendering
const OUTPUT_LABELS = ['success', 'failure'];
const COIN_TYPES = [822, 100000000];
const IDENTITY_STATUS = ['valid', 'obsolete'];

// storage keys
const GLOBAL_ACCESS_TOKEN_KEY_PREFIX = 'S1SEVEN_ACCESS_TOKEN';
const GLOBAL_ACCESS_TOKEN_KEY_PATTERN = `${GLOBAL_MODE_KEY}_%s`;
// configNodeIdentifier should be either the node name and if undefined the node id
const GLOBAL_ACCESS_TOKEN_KEY = (configNode) =>
  format(GLOBAL_ACCESS_TOKEN_KEY_PATTERN, configNode.name || configNode.id);

const GLOBAL_MODE_KEY_PREFIX = 'S1SEVEN_MODE';
const GLOBAL_MODE_KEY_PATTERN = `${GLOBAL_MODE_KEY}_%s`;
const GLOBAL_MODE_KEY = (configNode) =>
  format(GLOBAL_MODE_KEY_PATTERN, configNode.name || configNode.id);

module.exports = {
  ALGORITHM_OPTIONS,
  URL_TO_ENV_MAP,
  ENCODING_OPTIONS,
  MODE,
  COIN_TYPES,
  IDENTITY_STATUS,
  ACCOUNT_INDEX_MIN,
  ACCOUNT_INDEX_MAX,
  DEFAULT_API_VERSION,
  DEFAULT_API_ENVIRONMENT,
  DEFAULT_API_MODE,
  OUTPUT_LABELS,
  GLOBAL_MODE_KEY_PREFIX,
  GLOBAL_MODE_KEY_PATTERN,
  GLOBAL_MODE_KEY,
  GLOBAL_ACCESS_TOKEN_KEY_PREFIX,
  GLOBAL_ACCESS_TOKEN_KEY_PATTERN,
  GLOBAL_ACCESS_TOKEN_KEY,
};
