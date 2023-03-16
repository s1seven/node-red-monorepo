const { isAxiosError, AxiosResponse } = require('axios');
const { getMsg } = require('./async-local-storage');

/**
 * @typedef {object} NodeMessage
 * @property {unknown} payload
 * @property {string} topic
 * @property {string} _msgid
 */

/**
 * @description Send a message to the nodes wired.
 * @typedef {function} send
 * @param {NodeMessage | NodeMessage[]} messages
 * @returns {void}
 * @throws {Error}
 */

/**
 * @typedef {object} Response
 * @property {boolean} success
 * @property {object | Error} data
 */

/**
 * requestHandler - handles the axios request promise and sends the response to the node
 * @param {Promise<AxiosResponse>} request
 * @param {send} send
 * @param {NodeMessage} msg
 * @resolves {Response}
 */
const requestHandler = async (request, send) => {
  const newMsg = { ...getMsg() };
  try {
    const response = await request;
    newMsg.headers = response.headers || {};
    newMsg.payload = response.data;
    send([newMsg, null]);
    return { success: true, data: response.data };
  } catch (error) {
    const ex = isAxiosError(error) ? error.response?.data : error;
    const headers = isAxiosError(error) ? error.response?.headers : {};
    newMsg.payload = ex;
    newMsg.headers = headers;
    send([null, newMsg]);
    return { success: false, data: ex };
  }
};

module.exports = requestHandler;
