/**
 * Deploy artifacts from common/deploy/*
 */

import {
  ec2Run,
  ec2Terminate,
} from './aws-ec2-deploy.js';

// TODO: try to get previous instance id??

// TODO: try to shut down server

// TODO: try to trigger save of current instance runtime data

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
  throw new Error('problem running next instance, no id returned');
}

// TODO: try to restore save of previous instance runtime data

// TODO: try to start server

// TODO: try to remove environment network interface from current instance

// TODO: try to assign environment network interface to new instance

// TODO: try to update saved id for current active instance

// try to shut down ~~previous~~ instance
try {
  await ec2Terminate(nextInstanceId);
} catch (e) {
  console.error(e);
  throw new Error('problem terminating previous instance', { cause: e });
}
