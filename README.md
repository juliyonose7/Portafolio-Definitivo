# TRON-Style Portfolio (Black/Blue)

Modern personal portfolio with a TRON-inspired UI (dark glassmorphism, neon blue accents). Includes GitHub repo listing and visitor analytics with a global activity map.

## Features
- TRON UI with glass/blur and neon gradients
- Sections: Hero, About, Skills, Projects, Contact
- GitHub repo list with language filter
- Visitor analytics: total visits, country breakdown, and world map
- Responsive layout with accessibility improvements

## Usage
1. Open `index.html` in your browser.
2. Optional: change the default GitHub user in `script.js`:
   ```js
   const DEFAULT_GITHUB_USER = "your-user";
   ```
3. You can also use a query parameter: `index.html?u=usuario`.

## GitHub API
Uses `GET https://api.github.com/users/:user/repos?per_page=100&sort=updated`. For basic usage, no token is required. For higher rate limits, add `Authorization: Bearer <TOKEN>`.

## Visitor Analytics APIs
- **CountAPI** for total/country counters.
- **ipapi.co** for country/geo lookup.
- **world-atlas + D3 + TopoJSON** for the global map.

Configuration is in `api-config.js`.

## Customization
- Text/links in `index.html` and `index-en.html`
- Colors in `styles.css` (`:root` variables)

## License
MIT
