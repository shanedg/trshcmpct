# @trshcmpctr/deploy

## Deploy to AWS EC2

### AWS Resources

These resources are defined in the AWS Console

* KeyPair
* Elastic IPs
* IAM User
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

Name: `aws-deploy`
Permissions Policies:

* `AmazonEC2FullAccess`
* `AmazonS3FullAccess`

TODO: Reduce permissions to only what deploys need

##### Security Groups

TODO:

##### S3 Bucket

Name: `trshcmpctr.com`
