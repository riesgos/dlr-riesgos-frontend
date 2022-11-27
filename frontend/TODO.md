# Switch

- Peru
    - Tsunami
    - Ts-Damage
    - Sysrel
- Chile
- Ecuador

# Next

- Augmenter: only those products need to be resolved where a augmenter applies.
- Create new legend component (with gradients)
- Re-create graph-modal
- Eq-catalog: add missing parameters
- Restart, save- and reload-buttons
    Store current state *and* relevant data from resolver
- cd frontend && npx ts-unused-exports tsconfig.json

# Improvements for future

- Running two processes in parallel sometimes has one end up stuck
    - backend completes both processes
    - but frontend only fetches one 
        - Ohh! It's because request1 gets a new state1 that includes result1 and request2 gets a newState2 that includes result2.
        - Note how newState2 does not yet include result1.
        - Frontend needs to merge together those two new states.
            - Hmm, problem persists...
- Restructure directories:
    - two modules: one for map, one for wizard
        - share store between them: https://stackoverflow.com/questions/40089316/how-to-share-service-between-two-modules-ngmodule-in-angular-not-between-to-c
        - https://www.youtube.com/watch?v=oqZ4-ULwfbc
        - BUT: how do I then use the Augmentor? We'd need one augmentor for each module. 
    - all ngrx files in dir ngrx
- Wizard forms: Redesign
    - Global form does not get notified when its child-forms are updated
    - try removing the FromGroup from app-form
- Include jsonix license somewhere
- Remove layerMarshaller, have all map-products simply implement toUkisLayers.
- Docker-compose file for all services and frontend
- Eq-Selection: do we really need to have that selection step in the backend?
    - At least it should be simplified. It's silly that the frontend has the selected eq in it's memory already anyway.
- Backend: move away from WMS'es. Serve data yourself.
- Remove customized layer-control. Maybe ukis is good enough by now.
- Separate pages for each translation instead of dynamic translation
- Unify ng-translation, simplified translation, regex-translation
- Remove allowedCommonJsDependencies
- map.types.ts: do we still need those extensions of UKIS' own layer-types?

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

