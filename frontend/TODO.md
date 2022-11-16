# Cleanup

1. More fitting names for interfaces and methods
2. Remove data from state. Keep data in a data-service instead. Reason: this way redux can do much faster updates
3. Update redux to newest version
4. Separate logic from display
    4.1. Backend: steps
    4.2. Frontend: 
        4.2.1. Rename files to <step-name>.renderer.ts
        4.2.2. Remove wps-call-logic from renderers
        4.2.3. Have redux call backend-api
        4.2.4. Map backend-api-results to renderers



# Ukis - ongoing errors
- remove google fonts
- frontend must never have an own version of ol installed ... otherwise, `instanceof`checks in @eoc-dlr/maps-ol no longer work.
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
        - geotiff
        - turf
        - ukis
            - geotiff
            - ol
        - ol
            - ol_mapbox_style -> webfont-matcher
            - ol_mapbox_style -> mapbox-to-css-font