# Cleanup

- include english legend in deus
- create new legend component (with gradients)
- switch
    - update effects to call new backend
    - re-write /scenarios dir to only contain rendering logic
- remove data from state. Keep data in a data-service instead. Reason: this way redux can do much faster updates
- remove allowedCommonJsDependencies



# Ukis - ongoing errors
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
            - ol_mapbox_style -> webfont-matchera a
            - ol_mapbox_style -> mapbox-to-css-font
            - MVT -> pbf
            - BaseVector -> rbush

