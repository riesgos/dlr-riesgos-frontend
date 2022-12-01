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