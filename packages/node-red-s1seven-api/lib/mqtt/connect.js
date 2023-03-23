/// <reference path="../utils/typedefs.js" />

const { readFileSync } = require('node:fs');
const { join } = require('node:path');

/**
 * @param {RawSubflowItem[]} flow
 * @returns {number}
 */
function getMqttBrokerConfigIndex(flow) {
  return flow.findIndex((node) => node.type === 'mqtt-broker');
}

/**
 * @param {RawSubflowItem[]} flow
 * @returns {number}
 */
function getApiConfigIndex(flow) {
  return flow.findIndex((node) => node.type === 'api-config');
}

/**
 * This module is not yet ready to published, it is a work in progress and attempt to package a subflow.
 * The config nodes management is uncontrolled with subflow registration.
 * One thing that is not clear is how to ensure that the config nodes are available before the subflow is registered.
 * A second is how to dynamically pick and assign the config nodes to the subflow.
 * @type {RED_JS}
 */
module.exports = function (RED) {
  /**
   * @event Red.events#nodes:remove
   * @type {NodeRedNode}
   */
  RED.events.on('nodes:remove', (n) => {
    // TODO: check that our config nodes are still there
    // if (n.type === 'api-config') {
    // const apiConfigIndex = getApiConfigIndex(subflowJSON.flow);
    // }
  });

  RED.events.on('deploy', () => {});

  function getConfigNodes() {
    /** @type {NodeRedNode} */
    let apiConfig;
    /** @type {NodeRedNode} */
    let mqttConfig;
    // this pick the first config node of each type
    RED.nodes.eachNode((node) => {
      // TODO: check that node.z is undefined as it indicates config node is global
      if (node.type === 'api-config') {
        apiConfig = node;
      }
      if (node.type === 'mqtt-broker') {
        mqttConfig = node;
      }
    });
    return { apiConfig, mqttConfig };
  }

  function waitForConfigNodes() {
    // /** @type {NodeRedNode} */
    // let apiConfig;
    // /** @type {NodeRedNode} */
    // let mqttConfig;

    // while (!apiConfig || !mqttConfig) {
    //   setTimeout(() => {
    //     console.log('waiting for mqtt config and api config nodes');
    //     ({ apiConfig, mqttConfig } = getConfigNodes());
    //   }, 500);
    // }

    return new Promise((resolve) => {
      RED.log.info(
        'Waiting for mqtt config and api config nodes for MQTT connect subflow registration'
      );
      const { apiConfig, mqttConfig } = getConfigNodes();
      if (apiConfig && mqttConfig) {
        resolve({ apiConfig, mqttConfig });
      } else {
        setTimeout(() => {
          resolve(waitForConfigNodes());
        }, 500);
      }
    });
  }

  function populateSubflowConfigNodes() {
    const subflowFile = join(__dirname, 'connect.json');
    const subflowContents = readFileSync(subflowFile, 'utf-8');
    /** @type {ModuleSubflow} */
    const subflowJSON = JSON.parse(subflowContents);

    /**
     * since the subflow registration is immediate, RED.nodes are not yet loaded,
     * so we need to wait a bit before we can try to find the config nodes.
     * */
    return new Promise((resolve) => {
      setTimeout(async () => {
        const { apiConfig, mqttConfig } = await waitForConfigNodes();
        /** we are confident that the index will have a positive value as we wrote the subflow */
        const mqttConfigIndex = getMqttBrokerConfigIndex(subflowJSON.flow);
        const apiConfigIndex = getApiConfigIndex(subflowJSON.flow);
        subflowJSON.flow.splice(apiConfigIndex, 1, apiConfig);
        subflowJSON.flow.splice(mqttConfigIndex, 1, mqttConfig);
        resolve(subflowJSON);
      }, 500);
    });
  }

  populateSubflowConfigNodes.then((subflowJSON) => {
    RED.nodes.registerSubflow(subflowJSON);
  });
};
