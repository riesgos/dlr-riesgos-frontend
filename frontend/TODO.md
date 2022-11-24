# Switch
connect backend to frontend
    form: upon selecting a default parameter, notify backend
    eq-selection
    eq-catalog: add missing parameters
calculate step-state for every action
resolver: forget old data


# Cleanup
- google fonts austauschen in open-map-styles
    - https://github.com/openlayers/ol-mapbox-style/blob/HEAD/src/text.js#L185-L186
    - https://gitlab.dlr.de/ukis-frontend/project-fire/-/commit/ea091e8d87550613c1f8d7faecd200007480132b
- Include english legend in deus
- Create new legend component (with gradients)
- Re-create graph-modal
- cd frontend && npx ts-unused-exports tsconfig.json
- Save and restore:
    Store current state *and* relevant data from resolver
- two modules: one for map, one for wizard
    - share store between them: https://stackoverflow.com/questions/40089316/how-to-share-service-between-two-modules-ngmodule-in-angular-not-between-to-c
    - https://www.youtube.com/watch?v=oqZ4-ULwfbc
    - BUT: how do I then use the Augmentor? We'd need one augmentor for each module. 
- Include jsonix license somewhere
- RiesgosState contains API_Step and API_Datum. Give RiesgosState its own names for those data-structures ... even though their content is mostly identical.
- Remove layerMarshaller, have all map-products simply implement toUkisLayers.
- Remove allowedCommonJsDependencies

# New features
- Docker-compose file for all services and frontend

# Ongoing problems
- frontend must never have an own version of ol installed ... otherwise, `instanceof`-checks in @eoc-dlr/maps-ol won't work.
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

