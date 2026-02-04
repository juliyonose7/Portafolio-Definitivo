# Portafolio Aero (Negro/Azul)

Sitio web moderno tipo portafolio con estética aero negra con acentos azules. Integra la API pública de GitHub para listar repositorios de un usuario.

## Características
- UI oscura con vidrio/blur y brillos azules
- Secciones: Hero, Sobre mí, Habilidades, Proyectos, Contacto
- Lista repos desde GitHub con filtro por lenguaje
- Responsive y con mejoras de accesibilidad

## Uso
1. Abre `index.html` en tu navegador.
2. Opcional: cambia el usuario por defecto en `script.js`:
   ```js
   const DEFAULT_GITHUB_USER = "tu-usuario";
   ```
3. También puedes usar un query param: `index.html?u=usuario`.

## GitHub API
Se usa `GET https://api.github.com/users/:user/repos?per_page=100&sort=updated`. Para uso básico no requiere token. Para más peticiones, añade un token con el header `Authorization: Bearer <TOKEN>`.

## Personalización
- Textos/links en `index.html`
- Colores en `styles.css` (variables en `:root`)

## Licencia
MIT
