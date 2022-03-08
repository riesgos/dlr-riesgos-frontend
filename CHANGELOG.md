### Features
- show version from package.json in app header.

# Ongoing


### Bug Fixes
- **New version of Plotly.js:** Fixes bug where graph axes were not labeled.
- **Flood damage:** Products were not highlighted when associated process is selected.
- **Focus on selected earthquake:** Preliminarily selected earthquake is no longer a mappable-product. Only the finally selected one is. This way the right output product is highlighted in the layer-selection when a user focuses on the eq-selection step.
- **WebGL Polygon Renderer:** Now returns correct pixel value in `getDataAtPixel` method.

### Features
- **Removed @dlr-eoc/services-util-storage:** Better build time, less optimization bailouts due to module formats CommonJS or AMD.
- **Exposure is now passed to backend as a reference:** So no more need to `JSON.stringify` the exposure before uploading it. Speeds up things a lot.
- **Using same data-source for all tsunami-damage-layers:** Saves a lot of memory
- **Added vector-tile base-map:** Allows individually styling background layer. Adjusts to dark-mode.
- **Spectral acceleration data:** Now also displayed as another output of the ground-motion-service.
- **Colors:** updated color scales to be less saturated.
- **Administrative layers Peru**
- **Feature selection for earthquakes:** Now also includes magnitude in selection-field. Also displays detailed information in sidebar for selected earthquake.

### Breaking Changes
- **xyz:**

# [1.9.0](https://github.com/riesgos/dlr-riesgos-frontend/tree/v1.9) (2021-10-05) (merged in changes from middleware)
