#! /bin/bash
set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes



mkdir configs

echo "Building wps-server ... "
git clone https://github.com/riesgos/gfz-command-line-tool-repository
cd gfz-command-line-tool-repository
docker build -t gfzriesgos/riesgos-wps:latest -f assistance/Dockerfile . 
cd ..


echo "Building quakeldedger ..."
git clone https://github.com/GFZ-Centre-for-Early-Warning/quakeledger
cd quakeledger
docker image build --tag gfzriesgos/quakeledger --file ./metadata/Dockerfile .
cp metadata/quakeledger.json ../configs
cd ..


echo "Building assetmaster ..."
git clone https://github.com/gfzriesgos/assetmaster
cd assetmaster
docker image build --tag gfzriesgos/assetmaster --file ./metadata/Dockerfile .
cp metadata/assetmaster.json ../configs
cd ..
# @TODO: include data from ...


echo "Building shakyground ..."
git clone https://github.com/gfzriesgos/shakyground
cd shakyground
docker image build --tag gfzriesgos/shakyground --file ./metadata/Dockerfile .
cp metadata/shakyground.json ../configs
cd ..


echo "Building modelprop ..."
git clone https://github.com/gfzriesgos/modelprop
cd modelprop
docker image build --tag gfzriesgos/modelprop --file ./metadata/Dockerfile .
cp metadata/modelprop.json ../configs
cd ..


echo "Building deus ..."
git clone https://github.com/gfzriesgos/deus
cd deus
docker image build --tag gfzriesgos/deus --file ./metadata/Dockerfile .
cp metadata/deus.json ../configs
cd ..

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