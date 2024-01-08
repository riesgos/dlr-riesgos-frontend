# RIESGOS Admin Tools

Objective:
Allow any node-app to import all functionality commonly used in RIESGOS.

```js
const express = require(`express`);
const wpsClient = require(`riesgos-admintools/wps`);
const scriptParser = require(`riesgos-admintools/parser`);
const testScenario = require(`riesgos-admintools/test`);
const addScenarioApi = require(`riesgos-admintools/api`);

const app = express();

const factories = await scriptParser(`./scenarios`);
for (const factory of factories) {
    const testResult = await testScenario(factory);
    asset(testResult === `success`);
}

addScenarioApi(app, factories);
app.listen(5000);

// now visit localhost:5000/admin
// now visit localhost:5000/demopage
```

# DESIGN PRINCIPLES

-   **no state in backend** => more scalable if moving to AWS or similar
-   **complete state passed with every post** => simpler; theoretically allows backend to react to multiple changes in frontend
-   **concrete values passed per reference** => this way it's way less load to send along the whole state
    -   => also frontend can decide for itself which of those references it wants to resolve
-   **scenario's steps are defined in code** => allows arbitrary logic, even across steps
-   **independent of wps** => users commonly don't want to be bound to a specific API

## Minor design decisions

-   JS dependencies are fragile. Where there's no good reason to use a 3rd party library, write your own.
-   Transferring large data-objects as part of the state is not feasible when state needs to be exchanged between backend and frontend frequently. Instead data is kept in a store, while the state contains references to the entries in that store.
-   In geo-informatics in general and in riesgos in particular people make heavy use of webservices that only output parts of the whole data-set. We assume that all non-literal data is a web-reference per default.

# TODO's

-   Are Scenario and Store too tightly coupled?
    -   pass to scenario.step.execute only the relevant inputs, not the full state. Inputs already resolved
    -   have the input-resolution already happen outside.
-   References: only pass complex data per reference. Primitives should be passed per value between frontend and backend.
-   Should steps be passed data with their `reference` field intact, so that they can send data to 3rd-party-services per reference?
    -   I think they should! We should be un-opinionated when it comes to what a user can do.
    -   Should steps maybe even be passed direct access to file-storage, so that they can resolve data only when required?
-   Move away from remote wms'es, as well as from fetching references from 3rd-party wps'es, because they may disappear without notice.

# Config files

Can be found at `backend/src/config.json`.
