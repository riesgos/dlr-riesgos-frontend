# [... verison ...](... link ...) (... date ...) ... description

## Features
- 

## Bug Fixes
- Legend ecuador/damage post-lahar: fixed cut-off

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