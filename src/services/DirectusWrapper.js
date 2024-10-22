// src/services/DirectusWrapper.js
const axios = require('axios');
const providersConfig = require('../config/providers');
const COLLECTIONS = require('../config/collections');

class DirectusWrapper {
  constructor() {
    this.providers = new Map();
    this.collections = Object.values(COLLECTIONS);
    this.initializeProviders();
  }

  initializeProviders() {
    providersConfig.providers.forEach((provider) => {
      this.providers.set(provider.providerId, provider);
    });
  }

  getProviderConfig(providerId) {
    return this.providers.get(providerId) || null;
  }

  isValidCollection(collection) {
    return this.collections.includes(collection);
  }

  parsePaginationParams(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    return {
      page,
      limit,
      offset
    };
  }

  logRequest(url, params = {}, providerId) {
    const decodedUrl = decodeURIComponent(url.toString());
    console.log('\n=== API Request ===');
    console.log('Provider:', providerId);
    console.log('Endpoint:', decodedUrl);
    /* if (Object.keys(params).length > 0) {
      console.log('Parameters:', JSON.stringify(params, null, 2));
    } */
    console.log('==================');
  }
  
  logResponse(response, providerId) {
    console.log('\n=== API Response ===');
    console.log('Provider:', providerId);
    console.log('Status:', response.status);
    console.log('Total Items:', response.data.meta?.total_count || response.data.data.length);
    console.log('===================\n');
  }

  async fetchCollectionWithPagination(collection, providerId, query = {}) {
    try {
      if (!this.isValidCollection(collection)) {
        return {
          success: false,
          error: `Invalid collection: ${collection}`
        };
      }
  
      const config = this.getProviderConfig(providerId);
      
      if (!config) {
        return {
          success: false,
          error: `Provider ${providerId} not found`
        };
      }
  
      const pagination = this.parsePaginationParams(query);
  
      // Construir la URL base
      const url = new URL(`${config.endpoint}/items/${collection}`);
      
      // Agregar parámetros base
      url.searchParams.append('fields', '*.*.*');
      url.searchParams.append('limit', pagination.limit.toString());
      url.searchParams.append('offset', pagination.offset.toString());
  
      // Manejar filtros si existen
      if (query.filter) {
        const filterStr = JSON.stringify(query.filter);
        url.searchParams.append('filter', filterStr);
      }
  
      // Log de la petición incluyendo el providerId
      this.logRequest(url, query, providerId);
  
      // Realizar la consulta
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${config.token}`
        }
      });
  
      // Log de la respuesta incluyendo el providerId
      this.logResponse(response, providerId);
  
      const totalItems = response.data.meta?.total_count || response.data.data.length;
      const totalPages = Math.ceil(totalItems / pagination.limit);
  
      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalItems,
          totalPages,
          hasNextPage: pagination.page < totalPages,
          hasPrevPage: pagination.page > 1
        }
      };
  
    } catch (error) {
      console.error('\n=== API Error ===');
      console.error('Provider:', providerId);
      console.error('Message:', error.response?.data?.errors?.[0]?.message || error.message);
      if (error.response?.data) {
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
      }
      console.error('================\n');
  
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message
      };
    }
  }
}

module.exports = new DirectusWrapper();
