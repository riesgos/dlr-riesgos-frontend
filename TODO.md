

ashfall
  network issues
    transfer ashfall data via reference, not as body
    reduce size of files - not worth it
ecuador & peru
  replace admin boundaries with wms



ts-damage:
  - since its a wms, it does no longer contain the damage caused in the previous steps.
    - create custom layer with raster-source, calculating new color from both eq- and ts-damage wms.



# Middleware
- wps-client
  - replace rxjs with async/await
  - replace jsx
- create admin interface to arrange nodes in a scenario
- Mail:
  - connect to a legitimate MTA to avoid reputation-problems

# Frontend
- revamp layerselection
- replace translation service
- remove dependencies
  - ng5-slider
  - turf
  - ngx-translate
- products:
  - add `toUkisLayer` method