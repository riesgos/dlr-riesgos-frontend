export const environment = {
  production: false,
  middlewareUrl: 'https://riesgos.dlr.de/middleware',
  useProxy: true,
  proxyUrl: 'https://riesgos.dlr.de/proxy',
  useFallbackProxy: false,
  fallbackProxyUrl: 'https://hexaph.one/proxy',
  gfzUseStaging: false, // this would cause requests to 8443, which DLR won't allow.
};
