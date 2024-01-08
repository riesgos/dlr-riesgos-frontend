## Design

- **RX only**: No component should import a service, only the store.
  - Exception: config service
    - Can expect this to have been executed exactly once on startup
  - Exception: resolver
    - Returns full products, potentially large - those have no place in state.

## TODOs

# Config files

Can be found at `compare-frontend/src/assets/config/config.dev.json`.
