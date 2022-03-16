
# Content
0. create eq-scenario
   1. register eq-catalog ............................... done
   2. some way of selecting one eq ...................... done
   3. register eq-simulation ............................ done
   4. register assetmaster
   5. register vulnerability-service
   6. register eq-damage
1. anstoßen mehrerer eq-damages
   1. use the client to connect to the server ............................. done
   2. have the server run several processes from the eq-scenario 
   3. use the products to download data
2. sammle daten, erzeuge tiff mit perzentilen
   1. 


# Open questions
Server-side:
    - do products need a value field?
    - should products be defined inside the scenario-description?
    - to products need a scenario-field?


# Technical
- Simplification
  - migrate away from ts-node ......................... done
  - away from rxjs, just use promises
  - 