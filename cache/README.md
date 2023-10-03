create local geoserver: `sudo docker container run -d -p 8080:8080 -e SKIP_DEMO_DATA=true -e CORS_ENABLED=true --name geolocal docker.osgeo.org/geoserver:2.22.3` (note how data dir is not mounted anywhere)
fill local geoserver with data: `conda activate geo && python 4_uploadData.py`
start local geoserver `sudo docker container start geolocal`
copy data dir to tmp: `sudo docker container cp geolocal:/opt/geoserver_data ./geoserver_data`
start fresh geoserver `sudo docker container run -d -p 8080:8080 -e SKIP_DEMO_DATA=true -e CORS_ENABLED=true --name geofresh docker.osgeo.org/geoserver:2.22.3`
copy tmp into data dir `sudo docker container cp ./geoserver_data geofresh:/opt/`
`sudo docker container stop geofresh && sudo docker container start geofresh`




dmstr
- lineas de transmision: nicht mehr da?
Hugo's layer einfügen
Check ob alte extra-info layers verfügbar sind


### Feedback Harald
- 2er modus
    - 1er schritt rechts
    - da nicht weit genug rausgezoomt um eqs zu sehen
    - grund: schritt ist bereits aktiv; 
- dmg post tsunami
    - popups sind oben und unten abgeschnitten
    - bewege den kartenauschnitt damit popup zentraler liegt

### Feedback Elisabeth
- light:
    - licencias einfügen


### Feedback camilo

- total replacement cost after ts: consistent?
- @Hugo: will time to recuperation be in there?
- @Torsten: Frontendnummer Hochziehen?
- @Ebeth: reactivate expert mode on our own machine only?
-@Michael: write Camilo once newly cached version is deployed
