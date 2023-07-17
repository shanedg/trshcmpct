/**
 * Deploy artifacts from common/deploy/*
 */

import {
  ec2AssociateIp,
  ec2CreateTag,
  ec2DescribeByFilters,
  ec2DescribeStatus,
  ec2Run,
  ec2Terminate,
} from './aws-ec2-deploy.js';

// try to run a new instance
let nextInstanceId;
try {
  const runResult = await ec2Run();
  nextInstanceId = runResult.Instances[0].InstanceId;
} catch (e) {
  console.error(e);
  throw new Error('problem running next instance', { cause: e });
}

if (!nextInstanceId) {
  throw new Error('no id returned for next instance');
}
console.log('next instance id', nextInstanceId);

// try to get previous instance id
let activeRunningReservations = [];
try {
  const activeRunningInstancesResult = await ec2DescribeByFilters([
    {
      Name: 'instance-state-name',
      Values: ['running']
    },
    {
      Name: 'tag:lifecycle',
      Values: ['active']
    },
  ]);
  activeRunningReservations = activeRunningInstancesResult.Reservations;
} catch (e) {
  console.error(e);
  throw new Error('problem getting previous instance id');
}

if (activeRunningReservations > 1) {
  throw new Error('too many active instances running');
}

const previousInstanceId = activeRunningReservations.length ? activeRunningReservations[0].Instances[0].InstanceId : null;
console.log('previous instance id:', previousInstanceId ?? '<none>');

// try to poll for next instance to reach "running" state
const attemptDelay = 5 * 1000;
const checkInstanceStatusWithDelay = () => new Promise((resolve, reject) => {
  setTimeout(async () => {
    try {
      const statusResult = await ec2DescribeStatus(nextInstanceId);
      resolve(statusResult);
    } catch (e) {
      console.error(e);
      // TODO: is this an unhandled rejection? or does the rejected error mean it just throws?
      reject(new Error('problem checking instance status', { cause: e }));
    }
  }, attemptDelay);
});

const maxAttempts = 10;
let isReady = false;
let attempts = 0;
do {
  attempts += 1;
  const statusResult = await checkInstanceStatusWithDelay();
  if (statusResult.InstanceStatuses[0].InstanceState.Name === 'running') {
    isReady = true;
    console.log(`next instance found running (${attempts}/${maxAttempts})`);
  } else {
    console.log(`next instance is ${statusResult.InstanceStatuses[0].InstanceState.Name} (${attempts}/${maxAttempts})`);
  }
} while (!isReady && attempts < maxAttempts);

if (!isReady) {
  throw new Error(`next instance not running after polling ${attempts} times`);
}

// try to assign environment elastic ip address to new instance
try {
  // TODO: conditional on environment
  const stagingAllocationId = 'eipalloc-0b8f0bb1660204bec';
  await ec2AssociateIp(nextInstanceId, stagingAllocationId);
} catch (e) {
  console.error(e);
  throw new Error('problem associating elastic ip with next instance');
}

// try to terminate the previous instance
try {
  if (previousInstanceId) {
    await ec2Terminate(previousInstanceId);
  }
} catch (e) {
  console.error(e);
  throw new Error('problem terminating previous instance', { cause: e });
}

// try to replace lifecycle tag on next instance
try {
  await ec2CreateTag(nextInstanceId, [
    {
      Key: 'lifecycle',
      Value: 'active'
    },
  ]);
} catch (e) {
  console.error(e);
  throw new Error('problem updating tags on next instance', { cause: e });
}
