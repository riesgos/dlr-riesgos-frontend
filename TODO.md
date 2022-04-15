switching updated exposure to wms
 - add sld-style-name
 - translate titles
 - format popups with getFeatureInfo
allow new exposure models in tsunamis

ts-damage:
  - since its a wms, it does no longer contain the damage caused in the previous steps.
    - maybe revert ts-damage and use raw data like before?



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