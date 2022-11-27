# [... verison ...](... link ...) (... date ...) ... description

## Features
- 

## Bug Fixes
- 

## Breaking Changes
- 



# [2.0.0](... link ...) (... date ...) ... description

## Features

- **Moved step-logic into backend**
    - Justification:
        - Frontend was over-full, hard to maintain
        - Backend can now run steps as CI 
        - Central log of events and errors

- **No longer based on wps, but on abstract steps**
    - Many steps do not involve calling webservices
    - Setting up a webservice is hard, writing some js code in backend is relavitely easy

- **Frontend: ngrx-state is simple and abstract**
    - Individual components may add additional information to state using `Augmentors`.
    - But generally, information that is only relevant to one component should not pollute the global state.

- **Backend: no steps may not run side-effects**
    - Based on problem: Selecting an eq from the catalog-output
    - Decision: The backend will *not* set the `options` parameter of the `userChoice` parameter.
    - Justification: 
        - The catalog's output does already constitute the possible options for `userChoice`.
        - The alternative means that we'd allow side effects in the backend. 
        - This allows for so many complications that it's not worth the - already questionable - feature.
        - Examples of potential complications:
            - side-effects that add new values must be cached, side-effects that only add new options must not
            - if side-effects may output options to a datum, it's no longer guaranteed that new data consists 100% of *resolved* data