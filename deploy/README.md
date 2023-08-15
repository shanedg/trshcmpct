# @trshcmpctr/deploy

Deployment utilities for @trshcmcptr projects

## Deploy to AWS EC2

### AWS Console Resources

These resources are managed in the AWS Console

* KeyPair
* Elastic IPs
* IAM User
* IAM Instance Profile
* Security Group
* S3 Bucket

#### Key Pair

Provisioned separately to retain the .pem file

##### Elastic IPs

> Domains are custom resource records managed via <https://domains.google.com/>

* <www.trshcmpctr.com>
Allocation ID: `eipalloc-022c7934990a883c8`
* <www-stage.trshcmpctr.com>
Allocation ID: `eipalloc-0b8f0bb1660204bec`

##### IAM User

Credentials provided to GitHub Actions workflows to support:

* starting up a new instance
* tearing down the old instance
* uploading build artifacts

Name: `aws-deploy`
Permissions Policies:

* `AmazonEC2FullAccess`
* `AmazonS3FullAccess`
* `IAMFullAccess` (apparently needed to attach instance profile???)

TODO: Reduce permissions to only what deploys need

##### IAM Instance Profile

Credentials attached to running EC2 instances to support:

* downloading build artifacts
* starting up new instances
* tearing down old instances

Name: `aws-ec2-discord-runtime`
Role: `aws-ec2-discord-runtime`
Permissions Policies:

* `AmazonEC2FullAccess`
* `AmazonS3FullAccess`

See <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html>

TODO: Reduce permissions to only what deploys need

##### Security Groups

Rules for traffic ingress and egress, protocols, and ports

* default, all-traffic-from-vpc, default VPC security group
* ssh-from-my-ip, only-me, only let me in on :22
* public-http, public http/s, public http and https

##### S3 Bucket

Name: `trshcmpctr.com`
