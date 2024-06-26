/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { SFN } = require('@aws-sdk/client-sfn');

const stepFunctions = new SFN()

// Gets current number of running executions in state machine
const getQueueSize = async (record) => {
  const sfnParams = {
    stateMachineArn: process.env.StateMachineArn,
    maxResults: '1000',
    statusFilter: 'RUNNING'
  }
  console.log ({ sfnParams })
  const sfnResult = await stepFunctions.listExecutions(sfnParams)
  return sfnResult.executions.length
}

// Returns queue capacity
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  const MaxQueueCapacity = process.env.MaxQueueCapacity
  const QueueSize = await getQueueSize ()

  let result = false
  console.log(`Queue size: ${QueueSize}/${MaxQueueCapacity}`)
  if (QueueSize < MaxQueueCapacity) {
    result = true
  }

  return {
    isCapacityAvailable: result,
    MaxQueueCapacity,
    QueueSize
  }
}
