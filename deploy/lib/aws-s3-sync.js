import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import config from './config.json' assert { type: 'json' };

const {
  accessKeyId,
  s3ApiVersion = '2006-03-01',
  s3BucketName = 'trshcmpctr.com',
  s3Region = 'us-east-1',
  secretAccessKey,
} = config;

const s3Client = new S3Client({
  // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/locking-api-versions.html
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
  apiVersion: s3ApiVersion,
  region: s3Region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const getObject = async (path) => await s3Client.send(new GetObjectCommand({
  Bucket: s3BucketName,
  Key: path,
}));

export const putObject = async (path, body) => await s3Client.send(new PutObjectCommand({
  Body: body,
  Bucket: s3BucketName,
  Key: path,
}));
