### Features
- show version from package.json in app header.

# Ongoing


### Bug Fixes
- **New version of Plotly.js:** Fixes bug where graph axes were not labeled.

### Features
- **Removed @dlr-eoc/services-util-storage:** Better build time, less optimization bailouts due to module formats CommonJS or AMD.
- **Exposure is now passed to backend as a reference:** So no more need to `JSON.stringify` the exposure before uploading it. Speeds up things a lot.
- **Using same data-source for all tsunami-damage-layers:** Saves a lot of memory
- **Added vector-tile base-map:** Allows individually styling background layer. Adjusts to dark-mode.

### Breaking Changes
- **xyz:**

# [1.9.0](https://github.com/riesgos/dlr-riesgos-frontend/tree/v1.9) (2021-10-05) (merged in changes from middleware)
