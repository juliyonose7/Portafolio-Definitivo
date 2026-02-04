# 📚 API de Citas Históricas Colombianas

Una API REST que permite acceder a las frases más icónicas de importantes personajes históricos colombianos.

## 🎯 Descripción

Esta API proporciona acceso programático a citas históricas de personajes emblemáticos de la historia colombiana, incluyendo políticos, héroes de la independencia, científicos y líderes sociales.

## 👥 Autores Incluidos

- **Jorge Eliécer Gaitán** - Político y líder social
- **Policarpa Salavarrieta** - Heroína de la independencia
- **Antonio Nariño** - Prócer de la independencia
- **Antonio Ricaurte** - Héroe militar
- **Alexander von Humboldt** - Naturalista y explorador
- **Antonio José de Sucre** - Gran Mariscal de Ayacucho
- **José Celestino Mutis** - Científico y botánico
- **Gustavo Rojas Pinilla** - Presidente de Colombia

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Instalación
```bash
# Clonar o descargar el proyecto
cd APIREST

# Instalar dependencias
npm install

# Iniciar el servidor
npm start

# Para desarrollo (con auto-reload)
npm run dev
```

### Variables de Entorno
```bash
PORT=3000  # Puerto del servidor (opcional, por defecto 3000)
NODE_ENV=development  # Entorno de ejecución
```

## 📖 Endpoints de la API

### Base URL
```
http://localhost:3000
```

### 1. Información General
```http
GET /
```
**Descripción:** Información general de la API y endpoints disponibles.

**Respuesta:**
```json
{
  "message": "API de Citas Históricas Colombianas",
  "version": "1.0.0",
  "description": "API REST para obtener citas icónicas de personajes históricos colombianos",
  "endpoints": {
    "autores": "/api/autores",
    "citasPorAutor": "/api/autores/:nombre/citas",
    "citaAleatoria": "/api/citas/aleatoria",
    "todasLasCitas": "/api/citas",
    "autorEspecifico": "/api/autores/:nombre"
  },
  "autores_disponibles": ["Jorge Eliécer Gaitán", "Policarpa Salavarrieta", ...]
}
```

### 2. Obtener Todos los Autores
```http
GET /api/autores
```
**Descripción:** Lista todos los autores disponibles con información básica.

**Respuesta:**
```json
{
  "success": true,
  "total": 8,
  "autores": [
    {
      "nombre": "Jorge Eliécer Gaitán",
      "biografia": "Político y abogado colombiano...",
      "total_citas": 10,
      "epoca": "Siglo XX (1903-1948)"
    }
  ]
}
```

### 3. Obtener Autor Específico
```http
GET /api/autores/:nombre
```
**Descripción:** Obtiene información completa de un autor específico.

**Parámetros:**
- `nombre`: Nombre del autor (puede ser parcial)

**Ejemplo:**
```http
GET /api/autores/gaitan
GET /api/autores/policarpa
```

**Respuesta:**
```json
{
  "success": true,
  "autor": {
    "nombre": "Jorge Eliécer Gaitán",
    "biografia": "Político y abogado colombiano...",
    "epoca": "Siglo XX (1903-1948)",
    "total_citas": 10,
    "citas": [
      "¡Yo no soy un hombre, soy un pueblo!",
      "El pueblo es superior a sus dirigentes.",
      ...
    ]
  }
}
```

### 4. Obtener Citas de un Autor
```http
GET /api/autores/:nombre/citas
```
**Descripción:** Obtiene todas las citas de un autor específico.

**Parámetros:**
- `nombre`: Nombre del autor (puede ser parcial)

**Ejemplo:**
```http
GET /api/autores/nariño/citas
```

**Respuesta:**
```json
{
  "success": true,
  "autor": "Antonio Nariño",
  "total_citas": 10,
  "citas": [
    "¡No hay que esperar recompensa por servir a la patria!",
    "Dadme fuego del cielo para reducir a cenizas a los tiranos.",
    ...
  ]
}
```

### 5. Cita Aleatoria
```http
GET /api/citas/aleatoria
```
**Descripción:** Obtiene una cita aleatoria de cualquier autor.

**Respuesta:**
```json
{
  "success": true,
  "cita": {
    "autor": "Policarpa Salavarrieta",
    "cita": "¡Pueblo indolente! ¡Cuán distinta sería hoy vuestra suerte si conocierais el precio de la libertad!",
    "epoca": "Siglo XIX (1795-1817)"
  }
}
```

### 6. Cita Aleatoria de Autor Específico
```http
GET /api/citas/aleatoria/:autor
```
**Descripción:** Obtiene una cita aleatoria de un autor específico.

**Parámetros:**
- `autor`: Nombre del autor (puede ser parcial)

**Ejemplo:**
```http
GET /api/citas/aleatoria/humboldt
```

**Respuesta:**
```json
{
  "success": true,
  "autor": "Alexander von Humboldt",
  "cita": "El conocimiento es la riqueza que se puede transmitir sin empobrecerse.",
  "epoca": "Siglo XVIII-XIX (1769-1859)"
}
```

### 7. Todas las Citas
```http
GET /api/citas
```
**Descripción:** Obtiene todas las citas de todos los autores.

**Respuesta:**
```json
{
  "success": true,
  "total_citas": 80,
  "citas": [
    {
      "autor": "Jorge Eliécer Gaitán",
      "cita": "¡Yo no soy un hombre, soy un pueblo!",
      "epoca": "Siglo XX (1903-1948)"
    },
    ...
  ]
}
```

## 🔧 Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error interno del servidor

## 📝 Formato de Respuesta

Todas las respuestas siguen el siguiente formato:

```json
{
  "success": true|false,
  "message": "Mensaje descriptivo (en caso de error)",
  "data": "Datos específicos del endpoint"
}
```

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web para Node.js
- **CORS**: Middleware para manejo de CORS
- **Helmet**: Middleware de seguridad
- **JSON**: Base de datos de citas

## 🔒 Seguridad

- CORS habilitado para todas las rutas
- Helmet configurado para headers de seguridad
- Validación de entrada en todos los endpoints
- Manejo de errores centralizado

## 📊 Estadísticas

- **8 autores** históricos colombianos
- **80 citas** icónicas en total
- **10 citas** por autor en promedio
- Cobertura desde el siglo XVIII hasta el siglo XX

## 🤝 Contribuciones

Para contribuir a este proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para preguntas o sugerencias sobre esta API, puedes contactar al desarrollador.

---

**¡Disfruta explorando las citas históricas colombianas! 🇨🇴**
