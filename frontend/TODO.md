# Cleanup

1. More fitting names for interfaces and methods
2. Remove data from state. Keep data in a data-service instead. Reason: this way redux can do much faster updates
3. Update redux to newest version
4. Separate logic from display
    4.1. Backend: steps
    4.2. Frontend: 
        4.2.1. Rename files to <step-name>.renderer.ts
        4.2.2. Remove wps-call-logic from renderers
        4.2.3. Have redux call backend-api
        4.2.4. Map backend-api-results to renderers