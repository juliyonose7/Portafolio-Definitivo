// Ejemplos de uso de la API de Citas Históricas Colombianas
// Ejecutar con: node ejemplos.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function probarAPI() {
  console.log('🚀 Probando API de Citas Históricas Colombianas\n');

  try {
    // 1. Información general de la API
    console.log('1️⃣ Información general de la API:');
    const info = await axios.get(`${BASE_URL}/`);
    console.log(`📚 ${info.data.message}`);
    console.log(`📊 Autores disponibles: ${info.data.autores_disponibles.length}\n`);

    // 2. Obtener todos los autores
    console.log('2️⃣ Lista de todos los autores:');
    const autores = await axios.get(`${BASE_URL}/api/autores`);
    autores.data.autores.forEach(autor => {
      console.log(`👤 ${autor.nombre} - ${autor.total_citas} citas (${autor.epoca})`);
    });
    console.log('');

    // 3. Obtener información específica de un autor
    console.log('3️⃣ Información de Jorge Eliécer Gaitán:');
    const gaitan = await axios.get(`${BASE_URL}/api/autores/gaitan`);
    console.log(`📖 ${gaitan.data.autor.nombre}`);
    console.log(`📝 ${gaitan.data.autor.biografia}`);
    console.log(`⏰ ${gaitan.data.autor.epoca}`);
    console.log(`💬 Total de citas: ${gaitan.data.autor.total_citas}\n`);

    // 4. Obtener citas de un autor específico
    console.log('4️⃣ Citas de Policarpa Salavarrieta:');
    const citasPola = await axios.get(`${BASE_URL}/api/autores/policarpa/citas`);
    console.log(`👩‍🦱 ${citasPola.data.autor} - ${citasPola.data.total_citas} citas:`);
    citasPola.data.citas.slice(0, 3).forEach((cita, index) => {
      console.log(`   ${index + 1}. "${cita}"`);
    });
    console.log('');

    // 5. Obtener una cita aleatoria
    console.log('5️⃣ Cita aleatoria:');
    const citaAleatoria = await axios.get(`${BASE_URL}/api/citas/aleatoria`);
    console.log(`🎲 "${citaAleatoria.data.cita.cita}"`);
    console.log(`👤 - ${citaAleatoria.data.cita.autor} (${citaAleatoria.data.cita.epoca})\n`);

    // 6. Obtener cita aleatoria de un autor específico
    console.log('6️⃣ Cita aleatoria de Antonio Nariño:');
    const citaNariño = await axios.get(`${BASE_URL}/api/citas/aleatoria/nariño`);
    console.log(`🎯 "${citaNariño.data.cita}"`);
    console.log(`👤 - ${citaNariño.data.autor} (${citaNariño.data.epoca})\n`);

    // 7. Estadísticas generales
    console.log('7️⃣ Estadísticas de la API:');
    const todasLasCitas = await axios.get(`${BASE_URL}/api/citas`);
    console.log(`📊 Total de citas en la API: ${todasLasCitas.data.total_citas}`);
    console.log(`👥 Total de autores: ${autores.data.total}`);
    console.log(`📈 Promedio de citas por autor: ${Math.round(todasLasCitas.data.total_citas / autores.data.total)}\n`);

    console.log('✅ ¡Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error al probar la API:', error.message);
    if (error.response) {
      console.error('📄 Detalles del error:', error.response.data);
    }
  }
}

// Función para probar endpoints con errores
async function probarErrores() {
  console.log('\n🔍 Probando manejo de errores:\n');

  try {
    // Intentar obtener un autor que no existe
    console.log('1️⃣ Buscando autor inexistente:');
    await axios.get(`${BASE_URL}/api/autores/autor-inexistente`);
  } catch (error) {
    console.log(`❌ Error esperado: ${error.response.data.message}`);
    console.log(`💡 Sugerencias: ${error.response.data.sugerencias.slice(0, 3).join(', ')}...\n`);
  }

  try {
    // Intentar acceder a endpoint inexistente
    console.log('2️⃣ Accediendo a endpoint inexistente:');
    await axios.get(`${BASE_URL}/api/endpoint-inexistente`);
  } catch (error) {
    console.log(`❌ Error esperado: ${error.response.data.message}`);
    console.log(`📋 Endpoints disponibles: ${error.response.data.available_endpoints.length} endpoints\n`);
  }
}

// Ejecutar las pruebas
async function main() {
  await probarAPI();
  await probarErrores();
  
  console.log('🎉 ¡Pruebas completadas!');
  console.log('💡 Para usar la API, asegúrate de que el servidor esté corriendo en http://localhost:3000');
}

main();
