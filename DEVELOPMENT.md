# Development

This document serves as a brief introduction to working with and extending this frontend. 


## Business logic
Our RIESGOS business model consists of `processes` and `products`. They form a directed, bipartite graph: each process provides one or more products, which may or may not be the input to another process. We arrange that graph in a linear sequence by running a `toposort` on it. This linear sequence is then displayed in the UI: by arranging the processes in a sequence, we make it easier to guide the user through the chain of steps necessary to simulate a full scenario.


## Getting started
This project depends on the 'UKIS frontend libraries', which are distributed as packages on github. To use these packages, please follow the instructions on [the UKIS frontend libraries github page](https://github.com/dlr-eoc/ukis-frontend-libraries).


## Integrating external webservices

Usually, you'll be in one of the following situations:
 - You have some static information that you want to expose in the Riesgos-frontend. You can find [instructions for this here](#static-information).
 - You have an algorithm that you want to add to the Riesgos-framework. For this, you'll [expose your algorithm as a WPS](#exposing-an-algorithm-per-wps).
 - You already have a WPS and want to register it in the frontend. You'll find [instructions here](#integrating-a-wps-in-the-frontend). 

### Static information

A lot of relevant information does not require any user-input. Common examples are locations of fire-stations, courses of water-pipes, etc. Such information does not require any live computations and as such doesn't require a WPS-wrapper, either. It can instead be exposed as WMS, WFS etc. A common service to expose this kind of data is [geoserver](https://github.com/geoserver/geoserver).

Once you have your static data exposed, register it in the frontend as one of the so called `info-layers` in the file `src/app/components/map/map.component.ts`.

```js
// CustomLayer: Wrapper with UKIS-relevant information, like id, opacity, attribution etc.
const staticLayer = new CustomLayer({
    // custom_layer: Any openlayers-layer
    custom_layer: new TileLayer({
        source: new TileWMS({
            url: 'http://mapas.geoidep.gob.pe/geoidep/services/…/WMSServer?',
            params: {
                layers: '2',
                tiled: true
            },
            tileGrid: epsg4326TileGrid,
            crossOrigin: 'anonymous'
        })
    }),
    name: 'Departementos',
    id: 'departementos_idep',
    type: 'custom',
    visible: false,
    opacity: 0.6,
    attribution: '&copy, <a href="…">Instituto Geográfico Nacional</a>',
    popup: true
});

layers.push(staticLayer);

```

### Web Processing Service

A collection of Webservices using the WPS protocol constitute the core of the Riesgos framework. These services can be chained to model multi-risk-scenarios that the user can experiment with in the frontend.

---
**Visibility and safety**
> Exposing an algorithm per WPS to a network allows everyone on the network to run the algorithm - in the case of the internet, this would be everyone. For this reason, the same safety-precautions as for any other webservice apply here (you can find [more information here](https://owasp.org/)). Note also that exposing an algorithm as a service does not mean exposing its source code. It is absolutely possible to expose closed-source-algorithms as a service: the user can only see the service's output, not its code. 
---


#### Exposing an algorithm per WPS

In this section we create a - not very sophisticated - `Greeter`-algorithm and expose it to the internet per WPS. A lot of WPS implementations are freely available on the internet, like [geoserver's own WPS plugin](https://github.com/geoserver/geoserver/tree/master/src/extension/wps). Within the Riesgos framework, the most popular choice of WPS seems to be 52North's [JavaPS](https://github.com/52North/javaPS), amongst other reasons because 52North is actively developing this service to grow with the Riesgos-framework, including some event-driven functionality to be used in Riesgos 2.0. Extensive documentation can be found [here](http://52north.github.io/javaPS/documentation_markdown/site/index.html) - this section serves merely as a brief introduction.

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

 - If the real computation is implemented in java, you can just compile the algorithms jar into your project. 
 - Otherwise java offers a few methods to call other programs from within java-sourcecode. Here is an introduction on [running python programs from java](https://www.baeldung.com/java-working-with-python).

#### Integrating a WPS in the frontend

Once a WPS is available via the internet, you can register it in the frontend. This process differs between Riesgos 1.0 and 2.0. Within Riesgos 1.0 it is required to code the services name, url, and a few other properties in the frontend-source.

##### Riesgos 1.0
Adding a WPS into an existing scenario is a three step process. 

###### Creating the service: Implementing the Process-Interface
Any WPS must be represented by a class implementing the `Process` interface. 
Very often, you will want to extend the `WpsProcess` class: this is a class implementing the `Process` interface that already has the method `execute` implemented for you. Additionally, if you want the service to be visible in the UI, implement the interface `WizardableProcess`.
```js
/**
 * Our new service.
 *  - Extends WpsProcess: this is to describe a remote WPS that can be executed from the frontend.
 *  - Implements WizzardableProcess: this adds additional information to be displayed in the configuration-wizard. 
 */
export class MyGreeterService extends WpsProcess implements WizardableProcess {
    wizardProperties: WizardProperties;
    constructor(httpClient: HttpClient) {
        const uid = 'myGreeterService';  // frontend-wide
        const id = 'GreeterService';   // id of process on WPS
        const name = 'My greeter service';
        const description = 'A simple greeter';
        const serviceUrl = 'https://myserver.org/wps';
        const wpsVersion = '2.0.0';
        super(uid, name, [personToGreet.uid], [greeting.uid], id, 
              description, serviceUrl, wpsVersion, httpClient);
        this.wizardProperties = {
            providerName: 'My Company',
            providerUrl: 'mycompany.org',
            shape: 'bolt',   // what logo to use to the left of the service-name?
        };
    }
}



```
If your `execute` method needs to do more than just send an execute-request to a WPS, implement the interface `ExecutableProcess`. Doing this makes sense for example when you need to change your input-parameters' names or values before sending them off to the WPS.


###### Creating the products: Implementing the Product-Interface
A `product` is an object implementing the `Product` interface. Usually your products will come from and be sent to a WPS: in this case, they are `WpsData`.
If you do not want the WPS to return to you the actual data but merely a link to the data's location on the server, set `reference: true`.
```js
/**
 * Implements ...
 *  - WpsData: something that is returned from a WPS, and ...
 *  - Product: something that can be passed from service to service in the frontend.
 * Note that there are many useful subtypes of `Product`, like `StringSelectUconfProduct`, `VectorLayerProduct`, etc.
 * Many of these contain additional information that is required to display the product on a map. 
 */
const greeting: WpsData & Product = {
    // frontend-wide unique.
    uid: 'greeting',
    description: {
        // the id of the product on the WPS
        id: 'greeting',
        // whether to return a reference (a url pointing to the actual result) 
           or to return the literal result immediately.
        reference: false,
        type: 'literal'
    },
    value: null // ... null, as of yet. But that value will be set by `MyGreeterService`
};
```

###### Registering service and products in the scenario
Finally, for your service to be integrated into a scenario, it must be listed in the scenario's list of processes (and products).
You can register both scenarios and their component processes and products in the `RiesgosService`.
```js
public loadScenarioData(scenario: string): [Process[], Product[]] {
    ...

    let processes: Process[] = [];
    let products: Product[] = [];
    switch (scenario) {
      case 'c1':
        processes = [
          new ExposureSelection(this.httpClient, cache),
          new QuakeLedger(this.httpClient, cache),
          new MyGreeterService(this.httpClient),
          ...
        ];
        products = [
          modelChoice,	
	      personToGreet, greeting, 
          lonmin, lonmax, latmin, latmax, assettype,
	      ...
    ];
    break;
```

##### Riesgos 2.0

One of the aims of Riesgos 2.0 is to simplify the integration of new services. A WPS provider will no longer have to register his service directly in a frontend but in a more general, more open catalogue instead. This indirection is intended to open the Riesgos architecture to more third party services. Frontend-work will then only be required for defining unconventional styling of new products.


### Licenses
3rd party licenses are displayed with the component 'licenses.component'. This component requires there to be a file named 'licenses.json' in the assets directory. 
This file has been autogenerated with the 'license-checker' npm-module. When new dependencies are added, the file needs to be regenerated manually.
