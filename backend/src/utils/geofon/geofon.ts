import { Bbox } from "../../usr/wpsServices";
import axios from "axios";
import { Feature, FeatureCollection } from "geojson";


export class GeofonService {
    async getEqs(bbox: Bbox, mmin: number, mmax: number, zmin: number, zmax: number, p: number) {

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        const endDate = new Date();

        const requestUrl = `https://geofon.gfz-potsdam.de/eqexplorer/srv/api/v1/ogc/features/collections/events/items/`
            + `?offset=1&limit=50`  // The offset has a default value of 1 (it starts counting with 1). This is due to the FDSN standard.
            + `&orderby=time`
            + `&minmagnitude=${mmin}&maxmagnitude=${mmax}`
            + `&maxlatitude=${bbox.urlat}&minlatitude=${bbox.lllat}&maxlongitude=${bbox.urlon}&minlongitude=${bbox.lllon}`
            + `&maxdepth=${zmax * 1000}&mindepth=${zmin * 1000}`
            + `&starttime=${startDate.toISOString()}&endtime=${endDate.toISOString()}`;
    
    console.log("---------------------------------------------")  
    console.log(requestUrl)
    console.log("---------------------------------------------")  
    
        const response = await axios.get(requestUrl, {});
        const results: FeatureCollection = response.data;
        const shakeMlResults = this.convertToShakeMl(results);
        return shakeMlResults;

    }

    private convertToShakeMl(data: FeatureCollection) {


        const converted: FeatureCollection = {
            "type":"FeatureCollection",
            "features": []
        };

        for (const feature of data.features) {
            if (!feature.properties || !feature.properties.mt) continue;

            const convertedId = this.makeIdConform(feature.id + "");

            const newFeature: Feature = {
                type: "Feature",
                geometry: feature.geometry,
                properties: {
                        "publicID":                                             `${convertedId}`,
                        "preferredOriginID":                                    `${convertedId}`,
                        "preferredMagnitudeID":                                 `${convertedId}`,
                        "type":                                                 "earthquake",
                        "description.text":                                     "geofon",
                        "origin.publicID":                                      `${convertedId}`,
                        "origin.time.value":                                    `${this.makeTimeConform(feature.properties!.time)}`,
                        "origin.depth.value":                                   `${feature.properties!.depth / 1000}`,
                        "origin.creationInfo.value":                            "GFZ",
                        "magnitude.publicID":                                   `${convertedId}`,
                        "magnitude.mag.value":                                  `${feature.properties!.mag}`,
                        "magnitude.type":                                       `${feature.properties!.magnitudeType}`,
                        "magnitude.creationInfo.value":                         "GFZ",
                        "focalMechanism.publicID":                              `${convertedId}`,
                        "focalMechanism.nodalPlanes.nodalPlane1.strike.value":  `${feature.properties!.mt.strike1}`,
                        "focalMechanism.nodalPlanes.nodalPlane1.dip.value":     `${feature.properties!.mt.dip1}`,
                        "focalMechanism.nodalPlanes.nodalPlane1.rake.value":    `${feature.properties!.mt.rake1}`,
                        "focalMechanism.nodalPlanes.preferredPlane":            "nodalPlane1"
                },
                id: convertedId
            };

            converted.features.push(newFeature);
        }

        return converted;
    }


    private makeIdConform(id: string): string {
        // (smi|quakeml):[\w\d][\w\d\-\.\*\(\)_~']{2,}/[\w\d\-\.\*\(\)_~'][\w\d\-\.\*\(\)\+\?_~'=,;#/&]*
        // Wants quakeml:quakeledger/peru_70920014
        console.log(`quakeml:geofon/${id}`)
        return `quakeml:geofon/${id}`;
    }

    private makeTimeConform(time: string): string {
        // Cannot handle timezone other than Z(ulu) or UTC: 2023-08-18T10:27:55.870000+00:00
        // Wants 1746-10-28T00:00:00.000000Z
        const date = new Date(time);
        // return date.toUTCString();
        return `${date.getFullYear()}-${this.numberToPaddedString(date.getMonth(), 2)}-${this.numberToPaddedString(date.getDate(), 2)}T${this.numberToPaddedString(date.getHours(), 2)}:${this.numberToPaddedString(date.getMinutes(), 2)}:00.000000Z`;
    }

    private numberToPaddedString(val: number, len: number): string {
        let str = "" + val;
        while (str.length < len) {
            str = "0"+str;
        }
        return str;
    }
}