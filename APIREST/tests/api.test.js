// Pruebas básicas para la API de Citas Históricas Colombianas
// Ejecutar con: npm test (requiere instalar jest: npm install --save-dev jest)

const request = require('supertest');
const app = require('../server');

describe('API de Citas Históricas Colombianas', () => {
  
  describe('GET /', () => {
    test('Debería retornar información general de la API', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('API de Citas Históricas Colombianas');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.autores_disponibles).toBeDefined();
      expect(Array.isArray(response.body.autores_disponibles)).toBe(true);
    });
  });

  describe('GET /api/autores', () => {
    test('Debería retornar lista de todos los autores', async () => {
      const response = await request(app).get('/api/autores');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.total).toBeGreaterThan(0);
      expect(Array.isArray(response.body.autores)).toBe(true);
      
      // Verificar estructura de cada autor
      response.body.autores.forEach(autor => {
        expect(autor).toHaveProperty('nombre');
        expect(autor).toHaveProperty('biografia');
        expect(autor).toHaveProperty('total_citas');
        expect(autor).toHaveProperty('epoca');
        expect(typeof autor.total_citas).toBe('number');
      });
    });
  });

  describe('GET /api/autores/:nombre', () => {
    test('Debería retornar información de un autor específico', async () => {
      const response = await request(app).get('/api/autores/gaitan');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.autor.nombre).toContain('Gaitán');
      expect(response.body.autor.citas).toBeDefined();
      expect(Array.isArray(response.body.autor.citas)).toBe(true);
    });

    test('Debería retornar error 404 para autor inexistente', async () => {
      const response = await request(app).get('/api/autores/autor-inexistente');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Autor no encontrado');
    });
  });

  describe('GET /api/autores/:nombre/citas', () => {
    test('Debería retornar citas de un autor específico', async () => {
      const response = await request(app).get('/api/autores/policarpa/citas');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.autor).toContain('Salavarrieta');
      expect(response.body.total_citas).toBeGreaterThan(0);
      expect(Array.isArray(response.body.citas)).toBe(true);
    });
  });

  describe('GET /api/citas/aleatoria', () => {
    test('Debería retornar una cita aleatoria', async () => {
      const response = await request(app).get('/api/citas/aleatoria');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cita).toBeDefined();
      expect(response.body.cita.autor).toBeDefined();
      expect(response.body.cita.cita).toBeDefined();
      expect(response.body.cita.epoca).toBeDefined();
    });
  });

  describe('GET /api/citas/aleatoria/:autor', () => {
    test('Debería retornar una cita aleatoria de un autor específico', async () => {
      const response = await request(app).get('/api/citas/aleatoria/nariño');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.autor).toContain('Nariño');
      expect(response.body.cita).toBeDefined();
      expect(typeof response.body.cita).toBe('string');
    });
  });

  describe('GET /api/citas', () => {
    test('Debería retornar todas las citas', async () => {
      const response = await request(app).get('/api/citas');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.total_citas).toBeGreaterThan(0);
      expect(Array.isArray(response.body.citas)).toBe(true);
      
      // Verificar estructura de cada cita
      response.body.citas.forEach(cita => {
        expect(cita).toHaveProperty('autor');
        expect(cita).toHaveProperty('cita');
        expect(cita).toHaveProperty('epoca');
      });
    });
  });

  describe('Manejo de errores', () => {
    test('Debería retornar 404 para rutas inexistentes', async () => {
      const response = await request(app).get('/api/ruta-inexistente');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Endpoint no encontrado');
    });
  });
});
