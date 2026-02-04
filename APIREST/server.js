const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const autoresData = require('./data/autores.json');
const autoresInternacionalData = require('./data/autores-internacional.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas principales

// GET / - Información de la API
app.get('/', (req, res) => {
  res.json({
    message: 'API de Citas Históricas Colombianas',
    version: '1.0.0',
    description: 'API REST para obtener citas icónicas de personajes históricos colombianos',
    endpoints: {
      autores: '/api/autores',
      citasPorAutor: '/api/autores/:nombre/citas',
      citaAleatoria: '/api/citas/aleatoria',
      todasLasCitas: '/api/citas',
      autorEspecifico: '/api/autores/:nombre'
    },
    autores_disponibles: autoresData.map(autor => autor.nombre)
  });
});

// GET /api/autores - Obtener todos los autores
app.get('/api/autores', (req, res) => {
  try {
    const autores = autoresData.map(autor => ({
      nombre: autor.nombre,
      biografia: autor.biografia,
      total_citas: autor.citas.length,
      epoca: autor.epoca
    }));
    
    res.json({
      success: true,
      total: autores.length,
      autores: autores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/autores/:nombre - Obtener información específica de un autor
app.get('/api/autores/:nombre', (req, res) => {
  try {
    const nombreAutor = req.params.nombre.toLowerCase();
    const autor = autoresData.find(a => 
      a.nombre.toLowerCase().includes(nombreAutor) || 
      nombreAutor.includes(a.nombre.toLowerCase())
    );

    if (!autor) {
      return res.status(404).json({
        success: false,
        message: 'Autor no encontrado',
        sugerencias: autoresData.map(a => a.nombre)
      });
    }

    res.json({
      success: true,
      autor: {
        nombre: autor.nombre,
        biografia: autor.biografia,
        epoca: autor.epoca,
        total_citas: autor.citas.length,
        citas: autor.citas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/autores/:nombre/citas - Obtener todas las citas de un autor específico
app.get('/api/autores/:nombre/citas', (req, res) => {
  try {
    const nombreAutor = req.params.nombre.toLowerCase();
    const autor = autoresData.find(a => 
      a.nombre.toLowerCase().includes(nombreAutor) || 
      nombreAutor.includes(a.nombre.toLowerCase())
    );

    if (!autor) {
      return res.status(404).json({
        success: false,
        message: 'Autor no encontrado',
        sugerencias: autoresData.map(a => a.nombre)
      });
    }

    res.json({
      success: true,
      autor: autor.nombre,
      total_citas: autor.citas.length,
      citas: autor.citas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/citas/aleatoria - Obtener una cita aleatoria
app.get('/api/citas/aleatoria', (req, res) => {
  try {
    // Obtener todas las citas de todos los autores
    const todasLasCitas = [];
    autoresData.forEach(autor => {
      autor.citas.forEach(cita => {
        todasLasCitas.push({
          autor: autor.nombre,
          cita: cita,
          epoca: autor.epoca
        });
      });
    });

    // Seleccionar una cita aleatoria
    const citaAleatoria = todasLasCitas[Math.floor(Math.random() * todasLasCitas.length)];

    res.json({
      success: true,
      cita: citaAleatoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/citas - Obtener todas las citas de todos los autores
app.get('/api/citas', (req, res) => {
  try {
    const todasLasCitas = [];
    autoresData.forEach(autor => {
      autor.citas.forEach(cita => {
        todasLasCitas.push({
          autor: autor.nombre,
          cita: cita,
          epoca: autor.epoca
        });
      });
    });

    res.json({
      success: true,
      total_citas: todasLasCitas.length,
      citas: todasLasCitas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/citas/aleatoria/:autor - Obtener una cita aleatoria de un autor específico
app.get('/api/citas/aleatoria/:autor', (req, res) => {
  try {
    const nombreAutor = req.params.autor.toLowerCase();
    const autor = autoresData.find(a => 
      a.nombre.toLowerCase().includes(nombreAutor) || 
      nombreAutor.includes(a.nombre.toLowerCase())
    );

    if (!autor) {
      return res.status(404).json({
        success: false,
        message: 'Autor no encontrado',
        sugerencias: autoresData.map(a => a.nombre)
      });
    }

    const citaAleatoria = autor.citas[Math.floor(Math.random() * autor.citas.length)];

    res.json({
      success: true,
      autor: autor.nombre,
      cita: citaAleatoria,
      epoca: autor.epoca
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// =============================================
// RUTAS PARA AUTORES INTERNACIONALES
// =============================================

// GET /api/autores-internacional - Obtener todos los autores internacionales
app.get('/api/autores-internacional', (req, res) => {
  try {
    const autores = autoresInternacionalData.map(autor => ({
      nombre: autor.nombre,
      biografia: autor.biografia,
      total_citas: autor.citas.length,
      epoca: autor.epoca
    }));
    
    res.json({
      success: true,
      total: autores.length,
      autores: autores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/autores-internacional/random - Obtener una cita aleatoria de autores internacionales
app.get('/api/autores-internacional/random', (req, res) => {
  try {
    const categoria = req.query.categoria;
    
    // Obtener todas las citas de todos los autores internacionales
    let todasLasCitas = [];
    autoresInternacionalData.forEach(autor => {
      autor.citas.forEach(cita => {
        const citaObj = {
          autor: autor.nombre,
          cita: cita,
          epoca: autor.epoca,
          categoria: getCategoriaFromAuthor(autor.nombre)
        };
        
        // Filtrar por categoría si se especifica
        if (!categoria || citaObj.categoria === categoria) {
          todasLasCitas.push(citaObj);
        }
      });
    });

    if (todasLasCitas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron citas para la categoría especificada'
      });
    }

    // Seleccionar una cita aleatoria
    const citaAleatoria = todasLasCitas[Math.floor(Math.random() * todasLasCitas.length)];

    res.json({
      success: true,
      cita: citaAleatoria.cita,
      autor: citaAleatoria.autor,
      epoca: citaAleatoria.epoca,
      categoria: citaAleatoria.categoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Función helper para determinar la categoría de un autor
function getCategoriaFromAuthor(nombre) {
  const categorias = {
    'Tupac Shakur (2Pac)': 'philosophy',
    'Carl Sagan': 'science',
    'Linus Torvalds': 'technology',
    'Ridley Scott': 'entertainment',
    'Isaac Asimov': 'science',
    'Galileo Galilei': 'science',
    'Antonino Zichichi': 'science',
    'Donald Knuth': 'technology'
  };
  return categorias[nombre] || 'philosophy';
}

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    available_endpoints: [
      'GET /',
      'GET /api/autores',
      'GET /api/autores/:nombre',
      'GET /api/autores/:nombre/citas',
      'GET /api/citas',
      'GET /api/citas/aleatoria',
      'GET /api/citas/aleatoria/:autor',
      'GET /api/autores-internacional',
      'GET /api/autores-internacional/random'
    ]
  });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API de Citas Históricas Colombianas v1.0.0`);
  console.log(`👥 Autores disponibles: ${autoresData.length}`);
});

module.exports = app;