import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  EC2Client,
  RunInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';

import config from './config.json' assert { type: 'json' };

const {
  accessKeyId,
  amiImageId = 'ami-06ca3ca175f37dd66',
  ec2InstanceType = 't2.nano',
  ec2ApiVersion = '2016-11-15',
  ec2Region = 'us-east-1',
  keyPairName = 'discord-service',
  secretAccessKey,
} = config;

const ec2Client = new EC2Client({
  // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/locking-api-versions.html
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
  apiVersion: ec2ApiVersion,
  region: ec2Region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const ec2DeployUserData = readFileSync(new URL(join(dirname(import.meta.url), 'ec2-user-data.sh')));

/**
 * Run a new EC2 instance
 */
export const ec2Run = async () => await ec2Client.send(new RunInstancesCommand({
  InstanceType: ec2InstanceType,
  ImageId: amiImageId,
  MaxCount: 1,
  MinCount: 1,
  TagSpecifications: [
    {
      ResourceType: 'instance',
      Tags: [
        {
          Key: 'service',
          Value: 'discord'
        },
        {
          Key: 'environment',
          Value: 'production'
        },
      ]
    },
  ],
  UserData: ec2DeployUserData.toString('base64'),
  KeyName: keyPairName,
}));

/**
 * Terminate an EC2 instance
 * @param {string} instanceId
 * @returns
 */
export const ec2Terminate = async (instanceId) => await ec2Client.send(new TerminateInstancesCommand({
  InstanceIds: [instanceId],
}));
