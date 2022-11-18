# Cleanup

- switch
    - steps are expected to be potentially wizardable. 
        - That means adding descriptions, logos, ...
        - Used to be hardcoded onto process
        - Now: have a register of id's that are wizardable and map them to wizardable-info
    - getMapableProducts
    - data is now only stored per reference
        - provide a data-service that fetches the data on demand
        - ... and deletes it again when required
    - data is expected to have a toUkisLayers property
        - create a register of data-ids that map to those functions
- include english legend in deus
- create new legend component (with gradients)
- remove allowedCommonJsDependencies



# Ongoing problems
- frontend must never have an own version of ol installed ... otherwise, `instanceof`-checks in @eoc-dlr/maps-ol won't work.
- **ol.css**: 
    - Ukis 10.1.0 has made changes to its import of ol.css
    - It attempts to load ol.css per http - but since 10.1.0 this request errors out
    - You can load ol.css in angular.json/styles. 
        - This does apply the ol-styles, but the http error will persist until 10.2.0
- **CommonJS / AMD optimization bailouts**:
    - The following libs need updates:
        - helpers/d3charts -> plotly.js
        - renderers/polygon.renderer.ts -> earcut
        - ng5-slider
        - turf ... update didn't help
        - ol ... cannot update
            - geotiff
            - ol_mapbox_style -> webfont-matcher
            - ol_mapbox_style -> mapbox-to-css-font
            - MVT -> pbf
            - BaseVector -> rbush

