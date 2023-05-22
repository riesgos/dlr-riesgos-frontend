#! /bin/bash

# This script runs in the container right after start-up
# and sets some values in assets/config/config.prod.json from ENV variables.
# This way, when reconfiguration is required,
# the container only needs restarting, not rebuilding.

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes


if [[ -z "${sourceDir}" ]]; then
    echo "sourceDir not given"
    exit 1
fi
if [[ -z "${subPath}" ]]; then
    echo "subPath not given"
    exit 1
fi
if [[ -z "${backendUrl}" ]]; then
    echo "backendUrl not given"
    exit 1
fi
if [[ -z "${backendPort}" ]]; then
    echo "backendPort not given"
    exit 1
fi

sed -i "s|backendUrlPlaceholder|${backendUrl}|" ${sourceDir}/assets/config/config.prod.template.json
sed -i "s|backendPortPlaceholder|${backendPort}|" ${sourceDir}/assets/config/config.prod.template.json
sed -i "s|BaseHrefPlaceholder|${subPath}" ${sourceDir}/index.html
rm ${sourceDir}/assets/config/config.prod.json
mv ${sourceDir}/assets/config/config.prod.template.json ${sourceDir}/assets/config/config.prod.json

echo "Successfully created config-file"
cat ${sourceDir}/assets/config/config.prod.json


echo "Starting nginx"
nginx -g 'daemon off;'
