
// src/routes/api.js
const express = require('express');
const router = express.Router();
const DirectusWrapper = require('../services/DirectusWrapper');

router.get('/:collection/:providerId', async (req, res) => {
  // Log para ver los parámetros recibidos
  /* console.log('Route Parameters:', req.params);
  console.log('Query Parameters:', req.query); */

  const { collection, providerId } = req.params;
  const query = req.query;

  try {
    const response = await DirectusWrapper.fetchCollectionWithPagination(
      collection,
      providerId,
      query
    );
    
    if (response.success) {
      res.json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
