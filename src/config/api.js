const apiConfig = {
  protocol:  window.env.UMI_APP_API_PROTOCOL || process.env.UMI_APP_API_PROTOCOL || 'http',
  host: window.env.UMI_APP_API_HOST || process.env.UMI_APP_API_HOST || 'localhost',
  port: window.env.UMI_APP_API_PORT || process.env.UMI_APP_API_PORT || 80,
  prefix: window.env.UMI_APP_API_PREFIX || process.env.UMI_APP_API_PREFIX || '',
}

export default {
  baseUrl: `${apiConfig.protocol}://${apiConfig.host}:${apiConfig.port}/${apiConfig.prefix}`,
};
