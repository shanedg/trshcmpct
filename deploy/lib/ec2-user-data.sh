#!/usr/bin/env bash

# Debugging, connect and run:
# sudo tail -f /var/log/cloud-init-output.log

set -euo pipefail

echo "start user data"

# Convenience
echo 'alias l="ls -alhG"' >> /home/ec2-user/.bashrc

yum update -y

mkdir /home/ec2-user/lib
mkdir /home/ec2-user/lib/node

echo "install node"
curl https://nodejs.org/dist/v18.16.1/node-v18.16.1-linux-x64.tar.xz --output /home/ec2-user/lib/node/node-v18.16.1-linux-x64.tar.xz
(cd /home/ec2-user/lib/node && tar -xf node-v18.16.1-linux-x64.tar.xz)

chown -R ec2-user:ec2-user /home/ec2-user/lib

mkdir /home/ec2-user/bin

# Symlink node binaries to the local user bin folder
# See https://askubuntu.com/a/308048
# $PATH for systemd service amended via `ExecSearchPath=` in trshcmpctr-discord.service unit file
ln -s /home/ec2-user/lib/node/node-v18.16.1-linux-x64/bin/node /home/ec2-user/bin/node
ln -s /home/ec2-user/lib/node/node-v18.16.1-linux-x64/bin/npm /home/ec2-user/bin/npm

chown -R ec2-user:ec2-user /home/ec2-user/bin

mkdir /home/ec2-user/dist

# These values are replaced during a production deploy
server_name=www-stage.trshcmpctr.com
domains=www-stage.trshcmpctr.com
bucket_prefix=www-stage

echo "download build artifacts"
time aws s3 cp "s3://trshcmpctr.com/$bucket_prefix/deploy.zip" /home/ec2-user/deploy.zip

echo "inflate build artifacts"
time unzip -qq -o /home/ec2-user/deploy.zip -d /home/ec2-user/dist/

chown -R ec2-user:ec2-user /home/ec2-user/dist

yum install nginx -y

# Add this configuration to the default server block:
# * certbot modifies the server block that contains a matching server_name directive
#   see https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/#2.-Set-Up-NGINX
# * Reverse proxy all requests to @trshcmpctr/discord
echo "server_name $server_name;
location / {
  proxy_pass http://localhost:53134;
}
" > /etc/nginx/default.d/proxy-pass-to-discord.conf

# Must run nginx as root for access to :80/:443
# Debugging:
# sudo tail -f /var/log/nginx/error.log
# sudo tail -f /var/log/nginx/access.log
nginx

# Downloading and inflating existing letsencrypt configuration may fail
set +e
aws s3 cp s3://trshcmpctr.com/$bucket_prefix/letsencrypt.zip /home/ec2-user/
unzip /home/ec2-user/letsencrypt.zip -d /etc/letsencrypt/
letsencrypt_zip_inflate=$?
set -e

yum install -y python3
python3 --version
python3 -m venv certbot-env

# See https://www.shellcheck.net/wiki/SC1091
# shellcheck source=/dev/null
source /certbot-env/bin/activate
python3 -m pip install certbot certbot-nginx
certbot --version

if [ "$letsencrypt_zip_inflate" != 0 ]; then
  echo "letsencrypt configuration missing, will request new certificate"
  # Must run certbot as root to make changes to nginx
  # If running as ec2-user, pass $PATH to root for access to certbot-env binaries
  # e.g. `sudo -E env PATH="$PATH" certbot <...>`
  # See https://askubuntu.com/a/1342154
  # Use --test-cert to avoid certbot rate limits when testing installation or renewal
  # See https://letsencrypt.org/docs/staging-environment/
  certbot\
    -d $domains\
    --nginx\
    -n\
    -m shanedgarrity@gmail.com\
    --agree-tos\
    --cert-name $server_name\
    --hsts

else
  echo "installing existing certificate"
  certbot install\
    -d $domains\
    --nginx\
    -n\
    --cert-name $server_name\
    --hsts

  # Allow deploys to trigger renewals
  # Renewal will usually be a no-op, safe to run often
  certbot renew
fi
deactivate

# Zipping and uploading letsencrypt configuration may fail
set +e
(cd /etc/letsencrypt && zip --symlinks -r ./letsencrypt.zip ./*)
aws s3 cp /etc/letsencrypt/letsencrypt.zip s3://trshcmpctr.com/$bucket_prefix/
letsencrypt_zip=$?
set -e

if [ "$letsencrypt_zip" != 0 ]; then
  echo "letsencrypt archive upload failed, install or renewal may not have succeeded"
fi

# Run @trshcmpctr/discord as a systemd service
# Debugging:
# sudo systemctl status trshcmpctr-discord
cp /home/ec2-user/dist/discord/lib/trshcmpctr-discord.service /etc/systemd/system/trshcmpctr-discord.service
systemctl daemon-reload
service trshcmpctr-discord start

echo "end user data"
