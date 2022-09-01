# DESIGN PRINCIPLES

- no state in backend => more scalable if moving to AWS or similar
- complete state passed with every post => simpler; theoretically allows backend to react to multiple changes in frontend
- concrete values passed per reference => this way it's way less load to send along the whole state
  - => also frontend can decide for itself which of those references it wants to resolve
- scenario's steps are defined in code => allows arbitrary logic, even across steps
- independent of wps => users commonly don't want to be bound to a specific API


# TODO's

- Are Scenario and Store too tightly coupled?
  - pass to scenario.step.execute only the relevant inputs, not the full state. Inputs already resolved
  - have the input-resolution already happen outside.