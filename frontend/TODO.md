# Cleanup

- switch
    - getMapableProducts
        - data is now only stored per reference
            - provide a data-service that fetches the data on demand
    - data is expected to have a toUkisLayers property
        - create a register of data-ids that map to those functions
    - ngrx: now immutable state. remove exceptions for mutable data.
    - cd frontend && npx ts-unused-exports tsconfig.json
    - re-create graph-modal
    - include jsonix license somewhere
- include english legend in deus
- create new legend component (with gradients)
- remove allowedCommonJsDependencies

# Breaking up layout-configuration into registries
- `{id: UserConfigurableProduct}` in components/wizard-page
- `{id: WizardProperties}` in components/wizard-page
- Coming up: `{id: MapableProduct}` in components/map 


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

