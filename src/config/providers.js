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
    
    // Validar formato de endpoint
    try {
      new URL(provider.endpoint);
    } catch (error) {
      throw new Error(`Provider ${provider.providerId} has invalid endpoint URL`);
    }
  });

  // Verificar IDs únicos
  const ids = providers.map(p => p.providerId);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    throw new Error('All provider IDs must be unique');
  }

  return providers;
};

const getProvidersFromEnv = () => {
  try {
    const providersEnv = process.env.API_PROVIDERS;
    
    if (!providersEnv) {
      throw new Error('API_PROVIDERS environment variable is not defined');
    }

    // Limpiar el string de posibles caracteres especiales
    const cleanJson = providersEnv.trim();
    
    try {
      const providers = JSON.parse(cleanJson);
      return validateProviders(providers);
    } catch (parseError) {
      console.error('Raw API_PROVIDERS value:', providersEnv);
      throw new Error(`Failed to parse API_PROVIDERS as JSON: ${parseError.message}`);
    }
  } catch (error) {
    throw error;
  }
};

// Validar providers al inicializar el módulo
const providers = getProvidersFromEnv();

module.exports = {
  providers,
  validateProviders
};
