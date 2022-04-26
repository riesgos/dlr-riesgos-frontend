export const environment = {
  production: false,
  middlewareUrl: 'https://riesgos.dlr.de/middleware',
  proxyUrl: 'https://hexaph.one/proxy',
  useProxy: true,
  gfzUseStaging: false, // this would cause requests to 8443, which DLR won't allow.
};
