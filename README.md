![RIESGOS Logo](src/assets/logos/riesgos_base_small_en.svg "RIESGOS Logo")



## Disclaimer
> :warning: This is the prototype of a multi-risk exploration tool and still under development. **IMPORTANT**: the results shown here are not yet consolidated and therefore not suitable for planning or other practical applications. As explained in our [License](LICENSE), we cannot take any responsibility for damages arising from the use of this tool. This web application allows the processing, visualization and download of data from various authors. The licensing of this data and terms of use is always the responsibility of the authors of the data.


## Rationale
Natural hazards often consist of multiple, cascading processes (an earthquake causes a tsunami which damages powerlines, ...), whereas scientific models usually try to model just one of these processes at a time.
We exposed several scientific models as WPS and combined them in a simple web-frontend to allow for a more holistic approach to multistep risk-management.


## Background
This web application is a frontend for the orchestration of webservices. During the RIESGOS-project, a number of scientific models (resp. their results) have been exposed by the project-partners using the WPS ([web processing service](https://www.ogc.org/standards/wps)) protocol. This SOAP-protocol describes the in- and outputs to the model used. This website serves as a frontend to those models, aiming to:
 - allow the user to set the inputs to a model, trigger its execution and display the models results
 - chain a series of models together to form a scenario that depicts the mulititude of processes that describes a natural hazard (e.g. earthquake + tsunami + infrastructure, volcanic eruption + ashfall + lahar, ...)
 - make it easy for the user to explore the range of effects a natural hazard can have

## Team
Our team includes (in alphabetical order):
 - Böck, Mathias 
 - Langbein, Michael 
 - Mandery, Nico 
 - Mühlbauer, Martin 
 - Riedlinger, Torsten 
 - Schöpfer, Elisabeth 


## Business logic
Our RIESGOS business model consists of `processes` and `products`. They form a directed, bipartite graph: each process provides one or more products, which may or may not be the input to another process. We arrange that graph in a linear sequence by running a `toposort` on it. This linear sequence is then displayed in the UI: by arranging the processes in a sequence, we make it easier to guide the user through the chain of steps necessary to simulate a full scenario. 
For more instructions, consult [the development guide](DEVELOPMENT.md).


## Licenses

This software is licensed under the [Apache 2.0 License](LICENSE).

Copyright (c) 2020 German Aerospace Center (DLR) * German Remote Sensing Data Center * Department: Geo-Risks and Civil Security


## Funding

The  research  and  development  project  RIESGOS  (Grant  No.  03G0876)  is  funded  by  the  German  Federal Ministry of Education and Research (BMBF) as part of the funding programme ‘Client II - International Partnerships for Sustainable Innovation’.
