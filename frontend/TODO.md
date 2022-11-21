# Switch
    scenario-selection:
        define required properties
        create augmentor
    translate configuration into augmentors
    resolver: forget old data

# Cleanup
- Include english legend in deus
- Create new legend component (with gradients)
- Re-create graph-modal
- cd frontend && npx ts-unused-exports tsconfig.json
- Save and restore:
    Store current state *and* relevant data from resolver
- Include jsonix license somewhere
- RiesgosState contains API_Step and API_Datum. Give RiesgosState its own names for those data-structures ... even though their content is mostly identical.
- Remove layerMarshaller, have all map-products simply implement toUkisLayers.
- Remove allowedCommonJsDependencies


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
        - turf ... update didn't help
        - ol ... cannot update
            - geotiff
            - ol_mapbox_style -> webfont-matcher
            - ol_mapbox_style -> mapbox-to-css-font
            - MVT -> pbf
            - BaseVector -> rbush

