const { isAxiosError } = require('axios');

/**
 * requestHandler - handles the axios request promise and sends the response to the node
 * @param {an axios request promise} request
 * @param {the node send callback} send
 * @param {the node msg object} msg
 * @returns {object} {success: boolean, data: object|error}
 */
const requestHandler = async (request, send, msg) => {
  const newMsg = { ...msg };

  try {
    const response = await request;
    newMsg.payload = response.data;
    send([newMsg, null]);
    return { success: true, data: response.data };
  } catch (error) {
    const ex = isAxiosError(error) ? error.response.data : error;
    newMsg.payload = ex;
    send([null, newMsg]);
    return { success: false, data: ex };
  }
};

module.exports = requestHandler;
