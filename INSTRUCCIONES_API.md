# 🚀 Instrucciones para Ejecutar la API de Citas Históricas

## 📋 Pasos para Activar la API

### 1. Abrir Terminal/Consola
- En Windows: `Win + R` → escribir `cmd` → Enter
- En Mac: `Cmd + Space` → escribir `Terminal` → Enter
- En Linux: `Ctrl + Alt + T`

### 2. Navegar al Directorio de la API
```bash
cd "C:\Users\juliy\OneDrive\Escritorio\New folder\APIREST"
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Iniciar el Servidor
```bash
npm start
```

### 5. Verificar que Funciona
- Deberías ver: `🚀 Servidor corriendo en http://localhost:3000`
- Abre tu navegador y ve a: `http://localhost:3000`

## 🔧 Comandos Alternativos

### Para Desarrollo (con auto-reload):
```bash
npm run dev
```

### Para Probar la API:
```bash
node ejemplos.js
```

## 🌐 Endpoints Disponibles

Una vez que el servidor esté corriendo, puedes probar estos endpoints:

- `http://localhost:3000/` - Información general
- `http://localhost:3000/api/autores` - Lista de autores
- `http://localhost:3000/api/citas/aleatoria` - Cita aleatoria
- `http://localhost:3000/api/autores/gaitan/citas` - Citas de Gaitán

## ⚠️ Solución de Problemas

### Si aparece error de puerto ocupado:
```bash
# Cambiar puerto en server.js línea 4:
const PORT = process.env.PORT || 3001;
```

### Si no tienes Node.js instalado:
1. Ve a: https://nodejs.org/
2. Descarga la versión LTS
3. Instala siguiendo las instrucciones
4. Reinicia la terminal

### Si npm no funciona:
```bash
# Verificar instalación de Node.js:
node --version
npm --version
```

## 🎯 Una Vez que la API Esté Funcionando

1. **Mantén la terminal abierta** (no la cierres)
2. **Abre tu sitio web** en el navegador
3. **Ve a la sección "Citas Históricas Colombianas"**
4. **¡Disfruta las citas que cambian cada 30 segundos!**

## 🔄 Para Detener el Servidor

En la terminal donde está corriendo, presiona:
```
Ctrl + C
```

## 📱 Funcionalidades del Sitio Web

- ✅ **Citas aleatorias** cada 30 segundos
- ✅ **Timer visual** con círculo de progreso
- ✅ **Botón de refresh** manual
- ✅ **Efecto de pista de carros** en el borde
- ✅ **Material Design** con animaciones
- ✅ **Responsive** para móviles
- ✅ **Fallback** si la API no está disponible

---

**¡Listo! Tu sitio web ahora tiene integración completa con la API REST de citas históricas colombianas! 🇨🇴**
