# Cleanup

- switch
    - cd frontend && npx ts-unused-exports tsconfig.json
    - re-create graph-modal
    - include jsonix license somewhere
- include english legend in deus
- create new legend component (with gradients)
- remove layer-marshaller; just have every product define its toUkisLayers
- remove allowedCommonJsDependencies

# Breaking up layout-configuration into registries
- `{id: UserConfigurableProduct}` in components/wizard-page
- `{id: WizardProperties}` in components/wizard-page
- `{id: MappableProduct}` in riesgos/riesgos.datatypes
- `{id: ScenarioImage}` in views/scenarios


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

