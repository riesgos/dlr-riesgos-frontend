#! /bin/bash

mkdir downloadDir
cd downloadDir
curl https://nextcloud.awi.de/s/aNXgXxN9qk5RZRz/download/riesgos_tsunami_data.tgz -o riesgos_tsunami_data.tgz
tar -xzf riesgos_tsunami_data.tgz
rm riesgos_tsunami_data.tgz
mv data/data ../awiData
cd ..
rm -rf downloadDir
