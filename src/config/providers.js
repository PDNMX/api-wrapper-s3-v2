// src/config/providers.js
require('dotenv').config();

const validateProviders = (providers) => {
  if (!Array.isArray(providers) || providers.length === 0) {
    throw new Error('API_PROVIDERS must be a non-empty array of providers');
  }

  providers.forEach((provider, index) => {
    if (!provider.providerId) {
      throw new Error(`Provider at index ${index} is missing providerId`);
    }
    if (!provider.endpoint) {
      throw new Error(`Provider ${provider.providerId} is missing endpoint`);
    }
    if (!provider.token) {
      throw new Error(`Provider ${provider.providerId} is missing token`);
    }
    if (!provider.name) {
      throw new Error(`Provider ${provider.providerId} is missing name`);
    }

    // Validar formato de endpoint
    try {
      new URL(provider.endpoint);
    } catch (error) {
      throw new Error(`Provider ${provider.providerId} has invalid endpoint URL`);
    }
  });

  return providers;
};

const getProvidersFromEnv = () => {
  try {
    const providersEnv = process.env.API_PROVIDERS;

    if (!providersEnv) {
      throw new Error('API_PROVIDERS environment variable is not defined');
    }

    const providers = JSON.parse(providersEnv);
    return validateProviders(providers);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('API_PROVIDERS environment variable contains invalid JSON');
    }
    throw error;
  }
};

// Validar providers al inicializar el módulo
const providers = getProvidersFromEnv();

module.exports = {
  providers,
  validateProviders
};
