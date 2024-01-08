# Development

This document serves as a brief introduction to working with and extending this frontend.

## Business logic

-   backend: service orchestration
-   cache: some utility scripts for managing downloaded result data, not always used
-   monitor: periodically executes all services with a random selection of parameters; notifies admin on failure
-   frontend: standard frontend
-   compare-frontend: "light" frontend; simpler, more comfortable, less options to pick

## Getting started

Usually, you'll want to use [one of our stable releases](https://github.com/riesgos/dlr-riesgos-frontend/tags).

```bash
    git clone https://github.com/riesgos/dlr-riesgos-frontend -b v1.0_peru
    cd dlr-riesgos-frontend
```

You will want to [adjust the configuration files](#configfiles) according to your own needs.

From there, you can ...

-   ... [run a development version on your machine](#localdev)
-   ... [or build a deployable version of the code](#buildprod)

Also, note that there is a [docker-setup](#docker-setup) available, too.

**NOTE**: the instructions listed here only pertain to the services inside this repository. If you want to quickly setup the full RIESGOS architecture, please refer to the [buildall-repo](https://github.com/riesgos/buildall).

### <a name="configfiles"></a> Adjusting configuration

-   `frontend/src/assets/config/`
    -   `config.dev.json`: the development configuration. Should need no changes for your local development workflow.
    -   `config.prod.json`: the production configuration.
        -   `allowedScenarios`: list of scenarios you'll allow the user to interact with: `["Peru", "Chile", "Ecuador"]`
        -   `production`: keep this `true`
        -   `backendUrl`: points to where your `backend` service runs
        -   `proxyUrl`: in case you want your requests to go through a proxy - should only be required if some of your WPS'es products have complicated CORS settings.
    -   `config.prod.template.json`: like `config.prod.json`, but some placeholders in this file are being replaced when this code is run inside a docker-container (as is the case when using the locally provided `docker-compose.json`, or when this code is being run in [buildall](https://github.com/riesgos/buildall))
-   `compare-frontend/src/assets/config`:
    -   All files here are analogous to those in `frontend/src/assets/config`
-   `backend/src/`
    -   `config.json`:
        -   `port`: the port this app is to listen on
        -   `logDir`: where to keep logs
        -   `storeDir`: where to keep store (i.e. a cache of old results)
        -   `maxStoreLifeTimeMinutes`: how long to keep stored old results around
        -   `sender`: from which sender address should notifications to an admin be sent
        -   `sendMailTo`: admin-mail; person to be notified in case errors occur
        -   `maxLogAgeMinutes`: how long should logs be stored
        -   `verbosity`: "verbose" or "silent",
        -   `services`: dictionary of webservices that the backend should communicate with. For each key a server-url and a process-id must be specified, as can be found in a WPS'es process-description like [this one](https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?service=wps&version=1.0.0&request=DescribeProcess&identifier=org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess)
    -   `config.template.json`: like `config.json`, but some placeholders in this file are being replaced when this code is run inside a docker-container (as is the case when using the locally provided `docker-compose.json`, or when this code is being run in [buildall](https://github.com/riesgos/buildall))

### <a name="localdev"></a> Local development

For local development, use two terminals. In the first:

```bash
cd frontend
npm install
npm run start
```

And in the second:

```bash
cd backend
npm install
npm run start
```

The first terminal will start the frontend and reload it if any of its code changes. The frontend serves for graphically displaying all the results of your processing and allowing the user to configure inputs to your services.
The second terminal does the same for the backend - which serves for the communication with the actual scientific background-services.
With the default-development-configuration, your frontend should automatically look for your backend on the same local machine. That backend will then, in turn, use its development-configuration to look for the background-services online (as opposed to locally on your machine). That means that for this setup to work, the background services must be available online.

### <a name="buildprod"></a> Building a deployable version

Your particular CI might have different requirements, but a simple way to build the production code of all directories present in this repository would be this:

```bash
codeDir="/localhome/lang_m13/Desktop/code/dlr-riesgos-frontend"
backendDist="$codeDir/backend/"
monitorDist="$codeDir/monitor/"
frontendDist="$codeDir/frontend/dist/riesgos/"
lightDist="$codeDir/compare-frontend/dist/compare-frontend/"

cd $codeDir

read -p "Empty local store? " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
	rm -f $backendDist/data/store/*
	rm -f $backendDist/data/logs/*.txt
fi

read -p "Compile? " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
	echo "Building ..."
	cd ./backend
	if [ -d dist ]; then rm -r dist; fi
	npm run build:prod
	cd ../frontend
	if [ -d dist ]; then rm -r dist; fi
	npm run build:prod
	cd ../monitor
	if [ -d dist ]; then rm -r dist; fi
	npm run build:prod
	cd ../compare-frontend
	if [ -d dist ]; then rm -r dist; fi
	npm run build:prod
	cd $codeDir
fi
```

### <a name="docker-setup"></a> Docker setup

**NOTE**: This section describes setting up the different services inside this repository as docker-containers. However, this repository doesn't contain any of the scientific backend-services of the RIESGOS architecture, it only consists of services that handle orchestration (backend), presentation (frontend, compare-frontend) or utilities (cache, monitor). We've run those containers locally for debugging-purposes, but in general, if you want to have a full docker-setup, you should use the [buildall-repository](https://github.com/riesgos/buildall).

Notice that there is a `docker-compose.yml` in the root directory of this repo, as well as `Dockerfile`s in the backend, frontend, compare-frontend and monitor directories, as well as `containerInit.sh` scripts in most of them.

-   When you inspect the `docker-compose.yml`, you'll find it depends on several environment-variables.
-   Create a .env file which provides those values, particularly for `maxStoreLifeTimeMinutes`, `sendMailTo`, `sourceEmail`, `EqCatalogUrl`, `EqSimUrl`, `FragilityUrl`, `ExposureUrl`, `DeusUrl`, `NeptunusUrl`, `VolcanusUrl`, `TsunamiUrl`, `SysrelUrl`, `SysrelEcuadorUrl`, `LaharUrl`, `backendUrl`
    -   Since this setup doesn't contain the scientific backend-services, `EqCatalogUrl`, `EqSimUrl`, `FragilityUrl`, `ExposureUrl`, `DeusUrl`, `NeptunusUrl`, `VolcanusUrl`, `TsunamiUrl`, `SysrelUrl`, `SysrelEcuadorUrl`, `LaharUrl` must point to existing, live services.
-   Run the containers with `docker-compose up -d`

## Integrating external web-services

Usually, you'll be in one of the following situations:

-   You have some static information that you want to expose in the RIESGOS-frontend. You can find [instructions for this here](#static-information).
-   You have an algorithm that you want to add to the RIESGOS-framework. For this, you'll [expose your algorithm as a WPS](#exposing-an-algorithm-per-wps).
-   You already have a WPS and want to register it in the existing architecture. You'll find [instructions here](#integrating-a-wps-in-the-frontend).

### <a name="static-information"></a> Static information

A lot of relevant information does not require any user-input. Common examples are locations of fire-stations, courses of water-pipes, etc. Such information does not require any live computations and as such doesn't require a WPS-wrapper, either. It can instead be exposed as WMS, WFS etc. A common service to expose this kind of data is [geoserver](https://github.com/geoserver/geoserver).

Once you have your static data exposed, register it in the frontend as one of the so called `info-layers` in the file `src/app/components/map/map.component.ts`.

```js
// CustomLayer: Wrapper with UKIS-relevant information, like id, opacity, attribution etc.
const staticLayer = new CustomLayer({
    // custom_layer: Any openlayers-layer
    custom_layer: new TileLayer({
        source: new TileWMS({
            url: "http://mapas.geoidep.gob.pe/geoidep/services/…/WMSServer?",
            params: {
                layers: "2",
                tiled: true,
            },
            tileGrid: epsg4326TileGrid,
            crossOrigin: "anonymous",
        }),
    }),
    name: "Departementos",
    id: "departementos_idep",
    type: "custom",
    visible: false,
    opacity: 0.6,
    attribution: '&copy, <a href="…">Instituto Geográfico Nacional</a>',
    popup: true,
});

layers.push(staticLayer);
```

### Web Processing Service

A collection of web-services using the WPS protocol constitute the core of the RIESGOS framework. These services can be chained to model multi-risk-scenarios that the user can experiment with in the frontend.

---

**Visibility and safety**

> Exposing an algorithm per WPS to a network allows everyone on the network to run the algorithm - in the case of the internet, this would be everyone. For this reason, the same safety-precautions as for any other web-service apply here (you can find [more information here](https://owasp.org/)). Note also that exposing an algorithm as a service does not mean exposing its source code. It is absolutely possible to expose closed-source-algorithms as a service: the user can only see the service's output, not its code.

---

#### <a name="exposing-an-algorithm-per-wps"></a> Exposing an algorithm per WPS

In this section we create a - not very sophisticated - `Greeter`-algorithm and expose it to the internet per WPS. A lot of WPS implementations are freely available on the internet, like [geoserver's own WPS plugin](https://github.com/geoserver/geoserver/tree/master/src/extension/wps). Within the RIESGOS framework, the most popular choice of WPS seems to be 52North's [JavaPS](https://github.com/52North/javaPS), amongst other reasons because 52North is actively developing this service to grow with the RIESGOS-framework, including some event-driven functionality to be used in RIESGOS 2.0. Extensive documentation can be found [here](http://52north.github.io/javaPS/documentation_markdown/site/index.html) - this section serves merely as a brief introduction.

JavaPS is a Spring-based WebMVC application. To register an algorithm with JavaPS, it suffices to create a single bean:

```java
package org.n52.javaps.service;
//import statements omitted

@Algorithm(version = "1.0.0")
public class Greeter {
    private String person;
    private String greeting;

    @LiteralInput(identifier = "personToGreet")
    public void setPerson(String value) {
         this.person = value;
    }

    @Execute
    public void execute() {
         this.greeting = “Hello there, “ + this.person;
    }

    @LiteralOutput(identifier = "greeting")
    public String getGreeting() {
         return this.greeting;
    }

}
```

This class and all relevant methods are documented with annotations that give JavaPS all required information to describe the process and its requirements and outputs. From here on out, JavaPS takes care of exposing process-information, in- and output-marshalling (as long as proper marshallers already exist or are provided) and loadbalancing. The only task that remains for our `Greeter` class is to return the required outputs upon being presented with an input. In this specific case, all calculations happen within our `Greeter` class itself. In reality, you're more likely to call another interface for the actual computation.

-   If the real computation is implemented in java, you can just compile the algorithms jar into your project.
-   Otherwise java offers a few methods to call other programs from within java-sourcecode. Here is an introduction on [running python programs from java](https://www.baeldung.com/java-working-with-python).

#### <a name="integrating-a-wps-in-the-frontend"></a> Integrating a WPS in the existing architecture

This is a two-step-process:

-   For process logic, integrate the new WPS in the backend
-   For rendering logic, integrate it in the frontend

##### Step 1: Integration in the backend

-   In `backend/src/usr`, find the folder of the scenario that you'd like to integrate your new service in (in this example we'll use `chile`).
-   Create a new directory and a file, such as `backend/src/chile/9_myservice/myservice.ts`
-   Provide any logic required around calling your service - this logic is called a `step`. Example:

```ts
async function myService(inputs: Datum[]) {
    // If you depend on some other service's output - like here - make sure you use the right product-id.
    const input = inputs.find((i) => i.id === "myRequiredInput")!;
    const results = await fetch(`http://myservice/execute?input=${input.value}`);

    // You can run any kind of logic here.
    // Historically, RIESGOS would simply execute one given WPS process with some given inputs,
    // but that has proven to be too restrictive.
    // Commonly, more than one process is being executed in one step,
    // or output products are re-shaped after execution,
    // potentially depending on the values of other products,
    // and many more additional processing steps.

    return [
        {
            id: "myServiceOutput",
            value: wms,
        },
    ];
}

export const step: Step = {
    id: "MyService",
    title: "My Service",
    description: "Description of my service",
    inputs: [
        {
            id: "myRequiredInput",
        },
    ],
    outputs: [
        {
            id: "myServiceOutput",
        },
    ],
    function: myService,
};
```

-   Register your new step: in `src/usr/chile/chile.ts`, add:

```ts
import { ScenarioFactory } from "../../scenarios/scenarios";
...
import { step as myStep } from './9_myservice/myservice';

...
chileFactory.registerStep(myStep);

```

With those changes, your new step is now accessible through the backend-REST-API.

##### Step 2: Integration in the frontend

With the new step provided through the REST-API, the frontend will automatically be aware of the new step when it fetches meta-data from the backend.
What it will not know about, however, is how to render the results of your step. Some outputs may only consist of primitive values that don't need to be displayed on a map, but for most, you'll have to provide some rendering instructions.

For this, we _augment_ the REST-metadata with frontend-specific rendering instructions. Particularly, there are two important interfaces that you'll want to implement:

-   `MappableProductAugmenter` describes how to render a product on an openlayers-map
-   `WizardableStepAugmenter` describes all the text that needs to be displayed to the user in the "Configuration Wizard" UI element - including potentially dropdown-forms that allow the user to select inputs to your step.

```ts
export class MyServiceOutput implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === "myServiceOutput";
    }

    makeProductMappable(product: RiesgosProductResolved): VectorLayerProduct[] {
        return [
            {
                ...product,
                description: {
                    id: "myServiceOutput",
                    format: "application/vnd.geo+json",
                    name: "myServiceOutput",
                    icon: "router",
                    type: "complex",
                    vectorLayerAttributes: {
                        featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
                            return new olStyle({
                                fill: new olFill({
                                    color: [100, 100, 100, 0.5],
                                }),
                            });
                        },
                        detailPopupHtml: (props: object) => {
                            return `<h3>Some simple html</h3>`;
                        },
                        dynamicLegend: (value) => ({
                            component: LegendComponent,
                            inputs: {
                                entries: [
                                    {
                                        text: "Prob. 0.1",
                                        color: "#96fd7d",
                                    },
                                    {
                                        text: "Prob. 0.5",
                                        color: "#fdfd7d",
                                    },
                                    {
                                        text: "Prob. 0.9",
                                        color: "#fd967d",
                                    },
                                ],
                                continuous: true,
                                height: 90,
                                fractionGraphic: 0.1,
                            },
                        }),
                    },
                },
            },
        ];
    }
}

export class MyService implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === "MyService";
    }
    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: "Chile",
            wizardProperties: {
                providerName: "My institution",
                providerUrl: "https://my.institution.com/en/",
                shape: "router",
                dataSources: [
                    {
                        label: "My publication, 2019",
                        href: "https://my.institution.com/en/my-pub-2019",
                    },
                ],
            },
        };
    }
}
```

Finally, register your newly augmented service in `frontend/src/app/services/augmenter/augmenter.service.ts`:

```ts


/**
 * Our backend returns the core-data for each step.
 * But often we want to enrich that core data with additional information.
 * This information may be specific to only some components of the frontend, though.
 * This service enriches core-data with all extra-information that the frontend-components need.
 *
 * - `WizardableStepAugmenter`: makes step displayable in wizard
 * - `WizardableProductAugmenter`: makes product displayable in wizard
 * - `MappableProductAugmenter`: makes product displayable in map
 *
 * Since this class is also the point where each augmenter is instantiated, it can be used
 * to inject into the augmenters any necessary services or data.
 */

@Injectable({
  providedIn: 'root'
})
export class AugmenterService {

    ...

  constructor(...) {
    this.augmenters = [
      ...

      // Chile
      // inputs                                                // steps                  // outputs
      new EtypeChile(), new MminChile(), new MmaxChile(),
      new ZminChile(), new ZmaxChile(), new PChile(),          new QuakeLedgerChile(),    new AvailableEqsChile(),
      ...
                                                               new MyService(),           new MyServiceOutput()

      ...
    ];
  }


 ...
}
```

## Further information

There are `README.md` and `TODO.md` files in most of the subdirectories of this repository.
Those only contain information that is relevant to those particular sub-services, though. In large parts these are just lists of items that might at some point be changed or pointers to things idiomatic to that service.
The `DEVELOPMENT.md` file you're reading right now should be the general, canonical source of information on all things frontend and orchestration.
