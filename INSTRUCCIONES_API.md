# 🚀 Historical Quotes API - Runbook

## 📋 Quick Start

### 1. Open a Terminal
- Windows: `Win + R` → type `cmd` → Enter
- macOS: `Cmd + Space` → type `Terminal` → Enter
- Linux: `Ctrl + Alt + T`

### 2. Go to the API Folder
```bash
cd "C:\Users\juliy\OneDrive\Escritorio\Portfolio Definitivo\APIREST"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm start
```

### 5. Verify
- You should see: `🚀 Server running at http://localhost:3000`
- Open: `http://localhost:3000`

## 🔧 Useful Commands

### Development (auto-reload)
```bash
npm run dev
```

### API Smoke Test
```bash
node ejemplos.js
```

## 🌐 Available Endpoints

- `http://localhost:3000/` - API info
- `http://localhost:3000/api/autores` - Author list
- `http://localhost:3000/api/citas/aleatoria` - Random quote
- `http://localhost:3000/api/autores/gaitan/citas` - Quotes by Gaitán

## ⚠️ Troubleshooting

### Port already in use
```js
// Change port in server.js (line 4)
const PORT = process.env.PORT || 3001;
```

### Node.js not installed
1. Go to https://nodejs.org/
2. Download the LTS version
3. Install and restart the terminal

### npm issues
```bash
node --version
npm --version
```

## 🔄 Stop the Server
Press:
```
Ctrl + C
```

---

This API is optional for the portfolio site. It can be used if you re-enable the historical quotes module in the UI.
