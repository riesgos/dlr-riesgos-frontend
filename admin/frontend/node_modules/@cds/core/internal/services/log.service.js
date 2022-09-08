import{existsInWindow as o}from"../utils/exists.js";class n{static log(...o){t()&&r()&&console.log(...o)}static warn(...o){t()&&r()&&console.warn(...o)}static error(...o){t()&&r()&&console.error(...o)}}function r(){return!o(["jasmine"])}function t(){return!window.CDS.environment.production}export{n as LogService,t as notProductionEnvironment};
//# sourceMappingURL=log.service.js.map
