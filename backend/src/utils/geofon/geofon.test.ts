import { GeofonService } from "./geofon";

describe('testing geofon service', () => {


    it('should return data formated like quakeledger', async () => {

        const svc = new GeofonService();
        const results = await svc.getEqs({
            crs: 'EPSG:4326',
            lllat: -90, lllon: -180, urlat: 90, urlon: 180
        }, 0, 10, 0, 300, 0.0);

  
        const requiredFields = [ "publicID", "preferredOriginID", "preferredMagnitudeID", "type", "description.text", "origin.publicID", "origin.time", "origin.depth", "origin.creationInfo", "magnitude.publicID", "magnitude.mag", "magnitude.type", "magnitude.creationInfo", "focalMechanism.publicID",
        ];

        expect(results);
        for (const feature of results.features) {
            for (const key of requiredFields) {
                expect(Object.keys(feature.properties!).includes(key));
            }
        }
        

    });

});