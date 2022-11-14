# DESIGN PRINCIPLES

- no state in backend => more scalable if moving to AWS or similar
- complete state passed with every post => simpler; theoretically allows backend to react to multiple changes in frontend
- concrete values passed per reference => this way it's way less load to send along the whole state
  - => also frontend can decide for itself which of those references it wants to resolve
- scenario's steps are defined in code => allows arbitrary logic, even across steps
- independent of wps => users commonly don't want to be bound to a specific API


## Minor design decisions
- JS dependencies are fragile. Where there's no good reason to use a 3rd party library, write your own.
- Transferring large data-objects as part of the state is not feasible when state needs to be exchanged between backend and frontend frequently. Instead data is kept in a store, while the state contains references to the entries in that store.
- In geo-informatics in general and in riesgos in particular people make heavy use of webservices that only output parts of the whole data-set. We assume that all non-literal data is a web-reference per default. 

# TODO's

- Are Scenario and Store too tightly coupled?
  - pass to scenario.step.execute only the relevant inputs, not the full state. Inputs already resolved
  - have the input-resolution already happen outside.