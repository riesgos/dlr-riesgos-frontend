#! /bin/bash
set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes



mkdir -p configs


serverImage="gfzriesgos/riesgos-wps"
if [[ -z $( docker image ls | awk '{ print($1) }' | grep $serverImage ) ]]; then
        echo "Building $serverImage ... "
        git clone https://github.com/riesgos/gfz-command-line-tool-repository
        cd gfz-command-line-tool-repository
        docker build -t $serverImage:latest -f assistance/Dockerfile .
        cd .. 
else
        echo "Already exists: $serverImage"
fi


quakeLedgerImage="gfzriesgos/quakeledger"
if [[ -z $( docker image ls | awk '{ print($1) }' | grep $quakeLedgerImage ) ]]; then
        echo "Building $quakeLedgerImage ..."
        git clone https://github.com/gfzriesgos/quakeledger
        cd quakeledger
        docker image build --tag $quakeLedgerImage --file ./metadata/Dockerfile .
        cp metadata/quakeledger.json ../configs
        cd ..
else
        echo "Already exists: $quakeLedgerImage"
fi


assetMasterImage="gfzriesgos/assetmaster"
if [[ -z $( docker image ls | awk '{ print($1) }' | grep $assetMasterImage ) ]]; then
        echo "Building $assetMasterImage ..."
        git clone https://github.com/gfzriesgos/assetmaster
        cd assetmaster
        docker image build --tag $assetMasterImage --file ./metadata/Dockerfile .
        cp metadata/assetmaster.json ../configs
        # @TODO: include data from ...
        cd ..
else
        echo "Already exists: $assetMasterImage"
fi


shakyGroundImage="gfzriesgos/shakyground"
if [[ -z $( docker image ls | awk '{ print($1) }' | grep $shakyGroundImage ) ]]; then
        echo "Building $shakyGroundImage ..."
        git clone https://github.com/gfzriesgos/shakyground
        cd shakyground
        docker image build --tag $shakyGroundImage --file ./metadata/Dockerfile .
        cp metadata/shakyground.json ../configs
        # @TODO: include data ...
        cd ..
else
        echo "Already exists: $shakyGroundImage"
fi


modelPropImage="gfzriesgos/modelprop"
if [[ -z $( docker image ls | awk '{ print($1) }' | grep $modelPropImage ) ]]; then
        echo "Building $modelPropImage ..."
        git clone https://github.com/gfzriesgos/modelprop
        cd modelprop
        docker image build --tag $modelPropImage --file ./metadata/Dockerfile .
        cp metadata/modelprop.json ../configs
        cd ..
else
        echo "Already exists: $modelPropImage"
fi


deusImage="gfzriesgos/deus"
if [[ -z $( docker image ls | awk '{ print($1) }' | grep $deusImage ) ]]; then
        echo "Building $deusImage ..."
        git clone https://github.com/gfzriesgos/deus
        cd deus
        docker image build --tag $deusImage --file ./metadata/Dockerfile .
        cp metadata/deus.json ../configs
        cd ..
else
        echo "Already exists: $deusImage"
fi




echo "Building neptunus ..."
echo "Building volcanus ..."
echo "Building tsunami-service ..."
echo "Building sysrel ..."


echo "Setting up wps-server ..."
docker run -p8080:8080 \
        -v /var/run/docker.sock:/var/run/docker.sock \
        --name=wps \
        -d \
        -e CATALINA_OPTS=-Xmx12g\ -Xms12g \
        -e RIESGOS_MAX_CACHE_SIZE_MB=8192 \
        -e RIESGOS_GEOSERVER_USERNAME=admin \
        -e RIESGOS_GEOSERVER_PASSWORD=geoserver \
        -e RIESGOS_GEOSERVER_ACCESS_BASE_URL=http://localhost:8080/geoserver \ 
        -e RIESGOS_GEOSERVER_SEND_BASE_URL=http://localhost:8080/geoserver \
        gfzriesgos/riesgos-wps
cd gfz-command-line-tool-repository
cd assistance/SLD
./add-style-to-geoserver.sh
cd ../..
# @TODO: Update configuration to allow CORS. In assistance/geoserver-web.xml, insert <filter>
cd ..
docker cp ./configs/* wps:/usr/share/riesgos/json-configurations


echo "Building backend ..."
echo "Building frontend ..."
echo "Done!"