# 📚 Colombian Historical Quotes API

A REST API that exposes iconic quotes from relevant historical Colombian figures.

## 🎯 Overview

Provides programmatic access to historical quotes from politicians, independence leaders, scientists, and social leaders.

## 👥 Included Authors

- **Jorge Eliécer Gaitán** - Politician and social leader
- **Policarpa Salavarrieta** - Independence heroine
- **Antonio Nariño** - Independence leader
- **Antonio Ricaurte** - Military hero
- **Alexander von Humboldt** - Naturalist and explorer
- **Antonio José de Sucre** - Grand Marshal of Ayacucho
- **José Celestino Mutis** - Scientist and botanist
- **Gustavo Rojas Pinilla** - President of Colombia

## 🚀 Installation & Usage

### Prerequisites
- Node.js (v14+)
- npm

### Install
```bash
# Go to the API folder
cd APIREST

# Install dependencies
npm install

# Start the server
npm start

# Development (auto-reload)
npm run dev
```

### Environment Variables
```bash
PORT=3000          # Server port (optional, defaults to 3000)
NODE_ENV=development
```

## 📖 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. API Info
```http
GET /
```
**Description:** API metadata and available endpoints.

**Response:**
```json
{
  "message": "Colombian Historical Quotes API",
  "version": "1.0.0",
  "description": "REST API to retrieve iconic quotes from Colombian historical figures",
  "endpoints": {
    "authors": "/api/autores",
    "quotesByAuthor": "/api/autores/:nombre/citas",
    "randomQuote": "/api/citas/aleatoria",
    "allQuotes": "/api/citas",
    "author": "/api/autores/:nombre"
  },
  "available_authors": ["Jorge Eliécer Gaitán", "Policarpa Salavarrieta", ...]
}
```

### 2. List Authors
```http
GET /api/autores
```
**Description:** Returns all authors with basic info.

**Response:**
```json
{
  "success": true,
  "total": 8,
  "autores": [
    {
      "nombre": "Jorge Eliécer Gaitán",
      "biografia": "Colombian politician and lawyer...",
      "total_citas": 10,
      "epoca": "20th Century (1903-1948)"
    }
  ]
}
```

### 3. Get a Specific Author
```http
GET /api/autores/:nombre
```
**Description:** Returns detailed info for a specific author.

**Parameters:**
- `nombre`: Author name (partial match supported)

**Example:**
```http
GET /api/autores/gaitan
GET /api/autores/policarpa
```

**Response:**
```json
{
  "success": true,
  "autor": {
    "nombre": "Jorge Eliécer Gaitán",
    "biografia": "Colombian politician and lawyer...",
    "epoca": "20th Century (1903-1948)",
    "total_citas": 10,
    "citas": [
      "¡Yo no soy un hombre, soy un pueblo!",
      "El pueblo es superior a sus dirigentes.",
      ...
    ]
  }
}
```

### 4. Quotes by Author
```http
GET /api/autores/:nombre/citas
```
**Description:** Returns all quotes for an author.

**Parameters:**
- `nombre`: Author name (partial match supported)

**Example:**
```http
GET /api/autores/nariño/citas
```

**Response:**
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

### 5. Random Quote
```http
GET /api/citas/aleatoria
```
**Description:** Returns a random quote from any author.

**Response:**
```json
{
  "success": true,
  "cita": {
    "autor": "Policarpa Salavarrieta",
    "cita": "¡Pueblo indolente! ¡Cuán distinta sería hoy vuestra suerte si conocierais el precio de la libertad!",
    "epoca": "19th Century (1795-1817)"
  }
}
```

### 6. Random Quote by Author
```http
GET /api/citas/aleatoria/:autor
```
**Description:** Returns a random quote for a specific author.

**Parameters:**
- `autor`: Author name (partial match supported)

**Example:**
```http
GET /api/citas/aleatoria/humboldt
```

**Response:**
```json
{
  "success": true,
  "autor": "Alexander von Humboldt",
  "cita": "El conocimiento es la riqueza que se puede transmitir sin empobrecerse.",
  "epoca": "18th-19th Century (1769-1859)"
}
```

### 7. All Quotes
```http
GET /api/citas
```
**Description:** Returns all quotes from all authors.

**Response:**
```json
{
  "success": true,
  "total_citas": 80,
  "citas": [
    {
      "autor": "Jorge Eliécer Gaitán",
      "cita": "¡Yo no soy un hombre, soy un pueblo!",
      "epoca": "20th Century (1903-1948)"
    },
    ...
  ]
}
```

## 🔧 HTTP Status Codes

- `200 OK`: Success
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## 📝 Response Format

All responses follow this structure:

```json
{
  "success": true|false,
  "message": "Descriptive message (on error)",
  "data": "Endpoint-specific payload"
}
```

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **CORS**: CORS middleware
- **Helmet**: Security headers
- **JSON**: Quotes dataset

## 🔒 Security

- CORS enabled on all routes
- Helmet configured for secure headers
- Input validation on all endpoints
- Centralized error handling

## 📊 Stats

- **8 authors**
- **80 quotes** total
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
