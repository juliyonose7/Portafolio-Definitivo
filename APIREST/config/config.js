// Configuración de la API de Citas Históricas Colombianas

const config = {
  development: {
    port: 3000,
    cors: {
      origin: '*',
      credentials: true
    },
    logging: {
      level: 'debug',
      format: 'combined'
    }
  },
  
  production: {
    port: process.env.PORT || 3000,
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    },
    logging: {
      level: 'error',
      format: 'combined'
    }
  },
  
  test: {
    port: 3001,
    cors: {
      origin: '*',
      credentials: true
    },
    logging: {
      level: 'silent',
      format: 'dev'
    }
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];
