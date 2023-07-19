import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  AssociateAddressCommand,
  CreateTagsCommand,
  DescribeInstancesCommand,
  DescribeInstanceStatusCommand,
  EC2Client,
  RunInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';

import config from './config.json' assert { type: 'json' };

const {
  accessKeyId,
  amiImageId = 'ami-06ca3ca175f37dd66',
  ec2InstanceType = 't2.nano',
  // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/locking-api-versions.html
  ec2ApiVersion = '2016-11-15',
  ec2Region = 'us-east-1',
  keyPairName = 'discord-service',
  secretAccessKey,
} = config;

const ec2Client = new EC2Client({
  apiVersion: ec2ApiVersion,
  region: ec2Region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Associate an elastic ip address with an instance
 * @param {string} instanceId
 * @param {string} eipAllocationId
 */
export const ec2AssociateIp = async(instanceId, eipAllocationId) => await ec2Client.send(new AssociateAddressCommand({
  InstanceId: instanceId,
  AllocationId: eipAllocationId,
  AllowReassociation: true,
}));

/**
 * Create or update instance tags
 * Existing key values are overwritten
 * @param {string} resouceId
 * @param {Object[]} tags
 */
export const ec2CreateTag = async (resouceId, tags) => await ec2Client.send(new CreateTagsCommand({
  Resources: [resouceId],
  Tags: tags,
}));

/**
 * Get instances that match a set of filters
 * @param {Object[]} filters
 */
export const ec2DescribeByFilters = async (filters) => await ec2Client.send(new DescribeInstancesCommand({
  Filters: filters,
}));

/**
 * Get the state of an instance
 * @param {string} instanceId
 */
export const ec2DescribeStatus = async (instanceId) => await ec2Client.send(new DescribeInstanceStatusCommand({
  InstanceIds: [instanceId],
  IncludeAllInstances: true,
}));

const ec2DeployUserData = readFileSync(new URL(join(dirname(import.meta.url), 'ec2-user-data.sh')));

const nextInstanceTagSpecifications = [
  {
    ResourceType: 'instance',
    Tags: [
      {
        Key: 'service',
        Value: 'discord'
      },
      {
        Key: 'environment',
        // TODO: conditional on environment
        Value: 'staging'
      },
      {
        Key: 'lifecycle',
        Value: 'next'
      },
    ]
  },
];

/**
 * Run a new instance
 */
export const ec2Run = async () => await ec2Client.send(new RunInstancesCommand({
  InstanceType: ec2InstanceType,
  ImageId: amiImageId,
  MaxCount: 1,
  MinCount: 1,
  TagSpecifications: nextInstanceTagSpecifications,
  UserData: ec2DeployUserData.toString('base64'),
  KeyName: keyPairName,
  SecurityGroupIds: [
    'sg-16d1976a', // default, all-traffic-from-vpc, default VPC security group
    'sg-06660e98d1262583c', // ssh-from-my-ip, only-me, only let me in on :22
    // TODO: public http/s
  ],
}));

/**
 * Terminate an EC2 instance
 * @param {string} instanceId
 */
export const ec2Terminate = async (instanceId) => await ec2Client.send(new TerminateInstancesCommand({
  InstanceIds: [instanceId],
}));
