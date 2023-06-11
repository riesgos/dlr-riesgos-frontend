FROM node:18

WORKDIR backend

# install and build
COPY . .
RUN npm ci
RUN npm run build:prod

# config
ENV maxStoreLifeTimeMinutes "1440"

ENV port 8008
ENV logDir "./data/logs"
ENV storeDir "./data/store"
ENV maxStoreLifeTimeMinutes 60
ENV sender "info@test.com"
ENV sendMailTo ""
ENV maxLogAgeMinutes 1440
ENV verbosity "verbose"
ENV EqCatalogUrl "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
ENV EqSimUrl "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
ENV FragilityUrl "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
ENV ExposureUrl "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
ENV DeusUrl "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
ENV NeptunusUrl "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
ENV VolcanusUrl "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
ENV TsunamiUrl "https://riesgos.52north.org/wps"
ENV SysrelUrl "https://riesgos.52north.org/javaps/service"
ENV SysrelEcuadorUrl "https://riesgos.52north.org/javaps/service"
ENV LaharUrl "https://riesgos.52north.org/geoserver/ows"


# running
EXPOSE ${port}
CMD ["./initContainer.sh"]
