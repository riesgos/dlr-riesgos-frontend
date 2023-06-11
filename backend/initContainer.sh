#! /bin/bash

set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes
# set -x

cp ./src/config.template.json ./dist

declare -A vars
vars[port]=8008
vars[logDir]="./data/logs"
vars[storeDir]="./data/store"
vars[maxStoreLifeTimeMinutes]=60
vars[sender]="info@test.com"
vars[sendMailTo]=""
vars[maxLogAgeMinutes]=1440
vars[verbosity]="verbose"
vars[EqCatalogUrl]="https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
vars[EqSimUrl]="https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
vars[FragilityUrl]="https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
vars[ExposureUrl]="https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
vars[DeusUrl]="https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
vars[NeptunusUrl]="https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
vars[VolcanusUrl]="https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
vars[TsunamiUrl]="https://riesgos.52north.org/wps"
vars[SysrelUrl]="https://riesgos.52north.org/javaps/service"
vars[SysrelEcuadorUrl]="https://riesgos.52north.org/javaps/service"
vars[LaharUrl]="https://riesgos.52north.org/geoserver/ows"

for variableName in "${!vars[@]}"; do 

    if [[ -z $(printenv "$variableName") ]]; then
        variableVal="${vars[$variableName]}"
        echo "Using default value for $variableName: $variableVal"
    else
        variableVal=$(printenv "$variableName")
        echo "Setting value for $variableName: $variableVal"
    fi

    sed -i "s|${variableName}Placeholder|${variableVal}|" dist/config.template.json    
done


rm -f ./dist/config.json
mv ./dist/config.template.json ./dist/config.json
echo "Successfully created config-file"
cat ./dist/config.json

node dist/main.js