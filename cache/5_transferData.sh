#! /bin/bash

#------------------------------------------------------------------------
#     On local host
#------------------------------------------------------------------------

# create local geoserver:
sudo docker container run -d -p 8080:8080 -e SKIP_DEMO_DATA=true -e CORS_ENABLED=true --name sourceServer docker.osgeo.org/geoserver:2.22.3

#start local geoserver 
sudo docker container start sourceServer

#fill local geoserver with data: 
conda activate geo 
python 4_uploadData.py


#copy data dir to tmp: 
sudo docker container cp sourceServer:/opt/geoserver_data ./geoserver_data

sudo docker container stop sourceServer


#------------------------------------------------------------------------
#     On remote host
#------------------------------------------------------------------------

#start fresh geoserver 
sudo docker container run -d -p 8080:8080 -e SKIP_DEMO_DATA=true -e CORS_ENABLED=true --name targetServer docker.osgeo.org/geoserver:2.22.3`

#copy tmp into data dir 
sudo docker container cp ./geoserver_data targetServer:/opt/
sudo docker container stop targetServer
sudo docker container start targetServer