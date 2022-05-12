export const environment = {
  production: false,
  middlewareUrl: 'https://riesgos.dlr.de/middleware',
  proxyUrl: 'https://riesgos.dlr.de/proxy',
  useProxy: true,
  useFallbackProxy: false,
  fallbackProxyUrl: 'https://hexaph.one/proxy',
  gfzUseStaging: false, // this would cause requests to 8443, which DLR won't allow.
};
