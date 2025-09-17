// API Configuration for Portfolio
// Cambia estas URLs cuando despliegues en AWS

const API_ENDPOINTS = {
    // Desarrollo local
    LOCAL: {
        BASE_URL: 'http://localhost:3000/api',
        CORS_ENABLED: true
    },
    
    // Producción AWS
    AWS: {
        BASE_URL: 'https://b2vxto5510.execute-api.us-east-2.amazonaws.com/prod/',
        CORS_ENABLED: true
    }
};

// Cambia esto a 'AWS' cuando despliegues
const CURRENT_ENV = 'AWS';

// Configuración activa
const API_CONFIG = {
    BASE_URL: API_ENDPOINTS[CURRENT_ENV].BASE_URL,
    ENDPOINTS: {
        CITAS_COLOMBIANAS: '/citas/colombianas',
        AUTORES_INTERNACIONALES: '/citas/internacionales'
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}