// API Configuration for Portfolio
// Configuración para analítica de visitantes (sin backend propio)

const API_CONFIG = {
    VISITORS: {
        COUNT_BASE_URL: 'https://api.countapi.xyz',
        NAMESPACE: 'julian-portfolio-tron',
        GEO_URL: 'https://ipapi.co/json/'
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}