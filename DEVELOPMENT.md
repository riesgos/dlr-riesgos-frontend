# Development

This document serves as a brief introduction to working with and extending this frontend. 


## Business logic
@TODO

## Getting started
Usually, you'll want to use [one of our stable releases](https://github.com/riesgos/dlr-riesgos-frontend/tags).
```bash
    git clone https://github.com/riesgos/dlr-riesgos-frontend -b v1.0_peru
    cd dlr-riesgos-frontend
```

You will want to adjust the configuration files according to your own needs.

From there, you can ...
 - ... host a development version on your machine
 - ... or build a deployable version of the code 

### Adjusting configuration
@TODO

### Local development
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

### Deployable version
@TODO


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
@TODO
