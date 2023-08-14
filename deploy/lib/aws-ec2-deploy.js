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
  amiImageId = 'ami-08a52ddb321b32a8c',
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

/**
 * Get instance tags
 * @param {'staging'|'production'} environment
 */
const getNextInstanceTagSpecifications = environment => {
  return [
    {
      ResourceType: 'instance',
      Tags: [
        {
          Key: 'service',
          Value: 'discord'
        },
        {
          Key: 'environment',
          Value: environment
        },
        {
          Key: 'lifecycle',
          Value: 'next'
        },
      ]
    },
  ];
};

/**
 * Get environment server name for ec2 user data
 * @param {'staging'|'production'} environment
 */
const getUserDataServerName = environment => {
  if (environment === 'staging') {
    return 'server_name=www-stage.trshcmpctr.com';
  }

  if (environment === 'production') {
    // TODO: also register domain root trshcmpctr.com?
    // return 'server_name=trshcmpctr.com';
    return 'server_name=www.trshcmpctr.com';
  }

  throw new Error(`Unexpected environment: ${environment}`);
};

/**
 * Get environment domains for ec2 user data
 * @param {'staging'|'production'} environment
 */
const getUserDataDomains = environment => {
  if (environment === 'staging') {
    return 'domains=www-stage.trshcmpctr.com';
  }

  if (environment === 'production') {
    // TODO: also register domain root trshcmpctr.com?
    // return 'domains=trshcmpctr.com,www.trshcmpctr.com';
    return 'domains=www.trshcmpctr.com';
  }

  throw new Error(`Unexpected environment: ${environment}`);
};

/**
 * Get environment bucket prefix for ec2 user data
 * @param {'staging'|'production'} environment
 */
const getUserDataBucketPrefix = environment => {
  if (environment === 'staging') {
    return 'bucket_prefix=www-stage';
  }

  if (environment === 'production') {
    return 'bucket_prefix=www';
  }

  throw new Error(`Unexpected environment: ${environment}`);
};

/**
 * Run a new instance
 * @param {'staging'|'production'} environment
 */
export const ec2Run = async environment => await ec2Client.send(new RunInstancesCommand({
  IamInstanceProfile: {
    Name: 'aws-ec2-discord-runtime'
  },
  InstanceType: ec2InstanceType,
  ImageId: amiImageId,
  MaxCount: 1,
  MinCount: 1,
  TagSpecifications: getNextInstanceTagSpecifications(environment),
  UserData: Buffer.from(
    readFileSync(new URL(join(dirname(import.meta.url), 'ec2-user-data.sh')))
      .toString()
      .replace('server_name=www-stage.trshcmpctr.com', getUserDataServerName(environment))
      .replace('domains=www-stage.trshcmpctr.com', getUserDataDomains(environment))
      .replace('bucket_prefix=www-stage', getUserDataBucketPrefix(environment))
  ).toString('base64'),
  KeyName: keyPairName,
  SecurityGroupIds: [
    'sg-16d1976a', // default, all-traffic-from-vpc, default VPC security group
    'sg-06660e98d1262583c', // ssh-from-my-ip, only-me, only let me in on :22
    'sg-01b47ac15fe770bcb', // public-http, public http/s, public http and https
  ],
}));

/**
 * Terminate an EC2 instance
 * @param {string} instanceId
 */
export const ec2Terminate = async (instanceId) => await ec2Client.send(new TerminateInstancesCommand({
  InstanceIds: [instanceId],
}));
