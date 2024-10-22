const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

// Función para inicializar la aplicación
const initializeApp = () => {
  try {
    // Verificar que tenemos los providers configurados
    const { providers } = require('./config/providers');
    console.log('\n==== API Configuration ====');
    console.log('Loaded providers:', providers.map(p => p.providerId).join(', '));
    console.log('===========================\n');

    const app = express();
    const port = process.env.PORT || 3000;

    app.set('query parser', 'extended');
    
    app.use(cors());
    app.use(express.json());

    // Middleware para procesar los query params
    app.use((req, res, next) => {
      if (req.query.filter && typeof req.query.filter === 'string') {
        try {
          req.query.filter = JSON.parse(req.query.filter);
        } catch (e) {
          console.error('Error parsing filter:', e);
        }
      }
      next();
    });

    // Health check endpoint
    /* app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        providers: providers.map(p => ({
          id: p.providerId,
          endpoint: p.endpoint
        }))
      });
    }); */

    // Ruta base para el API
    app.use('/api/v1', apiRoutes);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error('\n=== Initialization Error ===');
    console.error('The API could not be started:');
    console.error(error.message);
    console.error('\nPlease check your environment configuration.');
    console.error('=========================\n');
    process.exit(1);
  }
};

// Iniciar la aplicación
initializeApp();
