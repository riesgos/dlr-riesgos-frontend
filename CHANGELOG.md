# Ongoing

## Long term work
- Remove plotly completely, use d3 only.
    Requires that createBarChart and createGroupedBarchart are not called from `detailPopupHTML`.
    Reason: d3 cannot handle dom-nodes that dont exist yet.
    For the new d3-graphs we need a dynamicPopupComponent.
    And for a dynamicPopupComponent we need to return a ProductCustomLayer, not a VectorLayerProduct.
- Integrate backend for content-redaction
- Old frontend: modularize
- Cache: move from file-cache to geoserver-cache
- Backend: known race-condition
    - backend is being sent some state for an execute-request
    - that state contains a reference to data that has by now expired
    - so the backend can't resolve that data
    - Solution:
        - backtrack: from the data-reference, find out what state was used to create the data, and reproduce it
        - do this recursively
        - requires database with metadata about the references

# [2.0.5]

## Features
- Overall:
    - all components of architecture now dockerized
- Backend
    - all ScenarioFactories can now register async conditions which must be fulfilled before the scenario may be used.
    - Execute: failing fast if data is outdated.
- Compare frontend
    - link click on eqSelection with form
    - mirrorClick rule now allows `include` and `exclude` of `compositeId`s
    - styles feature differently on click
    - Custom converter for wizard/eqSim
    - exposure now displayed
    - exposure wizard now configurable
    - exposure legend and styling
    - errors displayed in ui
    - on error: retry
    - simplified error-handling: backend-client retuns a Maybe, doesn't throw.
    - update autopilot:
        - needs not use that "first-step" condition anymore
        - can define on per-step-basis if autopilot required
    - auto-piloted steps are no longer interactive
    - layer control, syncing visibility between wizard and map
    - Icons
    - translation service
    - Ongoing:
        - eq-dmg: popup
        - eq-dmg: legend
    - Upcoming:
        - redo-button

## Bug fixes
- Compare frontend
    - Map zooms in to first available step right after selecting a scenario

# [2.0.4](https://github.com/riesgos/dlr-riesgos-frontend/releases/tag/2.0.4) (May 16 2023) Created monitor and new frontend  
## Features
- monitor: 
    - created service that regularly executes all riesgos-services
- backend: 
    - now provides optional default values for steps' inputs.
    - tickets now stay alive for a certain time after they've been fetched
    - added `execute?skipCache=true` option for execute-requests
    - added `runall.ts` which runs all steps once every hour.
    - added `expires` headers
- frontend: 
    - now allows multiple (dynamic) legends for one layer at the same time. Applied to eq-catalogue.
    - now has circle-legend
- Compare frontend
    - all code now in modules
    - map allows per-step data-converters which are semi-automatically injected
    - now displays available eq's, too.
    - using rules to decide what exactly to do in reducers
    - user can chose between rule-sets
    - map has click-behavior
        - add popup to map on click
        - can now close popups
        - popups get features at click location as input
        - composites can do arbitrary things on click
    - Rules now calculated from rule-set-name by dedicated service
    - LayerComposite methods are non-anonymous: allows accessing all properties with `this.`
    - Custom style for eq-selection layer.
    - Wizard now converts from dynamically selected converter, too, just like map does.
    - More than one step can be focused
    - Arbitrary screen-partitions possible
    - Wizards now have a default converter to fall back to
    - error-handling during process-execution
    - click on step toggles focus 
    - hides layers of un-toggled steps
    - parameter-selection shows labels in dropdown
    - insideOne ruleset: data now mirrored
    - auto-pilot only started when rules allow it
    - legends now displayed - if present
    - popup: increased close button clickable area
    - dropdown now selects value when clicked on map
    - wizard expanded from beginning: did need to move `share` up in filter-obs
    - reducers: parseAPIScenariosIntoNewState: strict typing
    - openlayers now runs outside of angular-zone

# [2.0.3](https://github.com/riesgos/dlr-riesgos-frontend/releases/tag/2.0.3) (Mar. 9 2023) Bug fixes  

## Bug fixes
- layer- and wizard-services no longer cause multiple ui-updates on every state-change (reason: base-observable now shared)
- click on map only fires click-handler *once*.
- removed superfluous console-logs
- literal parameters of eq-catalog were not accepted
    - because no `userDataProvided` action triggered when user edits literal values
- logging threw error on circular objects.
- race condition in making post-eq-damage mapable.
- wrong style and legend for chile-damage.
- *should* have fixed NS_BINDING_ABORTED (happend in Firefox, presumably because too many posts at the same time).
- error in one process does not stop processing of other processes.




# [2.0.2](https://github.com/riesgos/dlr-riesgos-frontend/releases/tag/2.0.2) (Feb. 2 2023) Redactional 


## Features
- Discrete legends: slight outline around each field
- Continuous legends: added marker-line
- Nicer styling for layer-details: no word-breaking, less distance between paragraph and legend.
- Styling:
    - Fixed positioning eq-selection
    - Legend titles smaller
    - Less spacing around form controls, paragraphs
    - Small tables a little bigger
    - Simplified EQ ID display
 - Fixed some dead links, added some data-sources
 - `Reconfigure` button disabled for a second so users can't click it accidentally when the step-menu pops open.
 - EQ-Catalog: added the parameters mmin, mmax, zmin, zmax, and p again.
 - EQ-Selection: showing id and magnitude for each element in dropdown.
 - Exposure popup: now highlights current building type and gives plain-text version of building class name.
 - Added new and corrected old data-sources .

## Bug Fixes
- Ecuador: fixed path-error for Lahars with P_ex < 10%
- Backend sometimes doesn't stop an erroneous process
    - Might be because it attempts to send an email, which did throw an error itself (separate bug, now resolved). So has to send another email ... which keeps repeating.
    - May be re-opened if the error occurs again.
- Frontend did sometimes not display error messages from backend. Reason was that caught observable could not be completed to get scenario-id and step-id. Fixed by adding that information to the thrown error.
- Damage-popups did not show `no-data`.




# [2.0.1](https://github.com/riesgos/dlr-riesgos-frontend/releases/tag/2.0.1) (Jan. 4 2023) Bugfix 

## Features

## Bug Fixes
- Bugfix: bad use of d3-color in damage-popup.
- Bugfix: when going back to eq-sim-service from further upstream, its products are not being highlighted. Reason: mistakenly gave the layer `productId = product.description.id`, should have been `productId = product.id`

## Breaking Changes


# [2.0.0](https://github.com/riesgos/dlr-riesgos-frontend/releases/tag/2.0.0) (Dec. 8 2022) Stable version of new frontend and backend

## Features
- Added testing-suite to frontend's ngrx-state-manager

## Bug Fixes
- Legend ecuador/damage post-lahar: fixed cut-off
- Frontend-state: fixed race-conditions in calculating state when two processes run in parallel

## Breaking Changes
- 



# [2.0.0-alpha](https://github.com/riesgos/dlr-riesgos-frontend/releases/tag/2.0.0-alpha) (Dec. 1 2022) All orchestration-logic in backend

> Large refactor.
>
> **Motivation** was a problem seen when attempting to use Riesgos at other institutions.
> - Replacing services was hard. Reason: new services provide data in new formats, and often downstream processes require a very specific input format.
> - Solution: we provide a layer between the frontend and the webservices. This layer - a node.js-backend - serves to handle all the harmonization between the actual webservices.
> - Any required duct-taping of service-outputs can now be handled in this intermediate layer.

Previously there was already a lot of harmonization-code in the frontend's `WpsProcess` classes. But that meant that the frontend would manage webservices, their orchestration, their harmonization, in *addition* to all its usual tasks (state-management, error-displaying, converting output-data into a format that can be displayed on the map, ...)


## Features

- **Moved step-logic into backend**
    - Justification:
        - Frontend was over-full, hard to maintain
        - Backend can now run steps as CI 
        - Central log of events and errors
        - *Most important*: Easier harmonization of webservices.

- **No longer based on wps'es, but on abstract steps**
    - Many steps do not involve calling a webservices, and many more involve calling several.
    - Setting up a webservice is hard, writing some js code in backend is relavitely easy.
    - *Most important*: often steps had cross-dependencies. Having them all in the backend allows the developer one point where changes to the harmonization can be made.

- **Frontend: ngrx-state is simple and abstract**
    - Individual components may add additional information to state using `Augmentors`.
    - But generally, information that is only relevant to one component should not pollute the global state.

- **Backend: steps may not run side-effects**
    - Based on problem: Selecting an eq from the catalog-output
    - Decision: The backend will *not* set the `options` parameter of the `userChoice` parameter.
    - Justification: 
        - The catalog's output does already constitute the possible options for `userChoice`.
        - The alternative means that we'd allow side effects in the backend. 
        - This allows for so many complications that it's not worth the - already questionable - feature.
        - Examples of potential complications:
            - side-effects that add new values must be cached, side-effects that only add new options must not
            - if side-effects may output options to a datum, it's no longer guaranteed that new data consists 100% of *resolved* data

- **Data passed per reference per default**
    - Riesgos uses a *lot* of data
    - All that data clogs up browser memory, makes ngrx-state too big to be easily re-created, and takes long to download
    - So now we pass data per reference. Those references are resolved lazily. Once resolved data is also cached.