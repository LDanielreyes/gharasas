const axios = require('axios');

async function testServices() {
  try {
    const baseURL = 'http://127.0.0.1:3001/api';

    // 1. Iniciar sesión
    console.log('--- 1. Autenticación ---');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@gharasas.com',
      password: 'GharaAdmin2026!'
    });
    const token = loginRes.data.data.accessToken;
    console.log('Login Exitoso. Token OK.');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Testing public endpoints
    console.log('\n--- 2. Endpoints Públicos ---');
    
    try {
      const prodRes = await axios.get(`${baseURL}/productos`);
      console.log('✅ GET /productos:', prodRes.data.data.length, 'productos obtenidos.');
    } catch(e) { console.error('❌ GET /productos:', e.message); }

    try {
      const faqRes = await axios.get(`${baseURL}/faq`);
      console.log('✅ GET /faq:', faqRes.data.data.length, 'FAQs obtenidos.');
    } catch(e) { console.error('❌ GET /faq:', e.message); }

    // 3. Testing admin endpoints
    console.log('\n--- 3. Endpoints Admin ---');
    
    try {
      const dashRes = await axios.get(`${baseURL}/admin/analytics/dashboard`, { headers });
      console.log('✅ GET /admin/analytics/dashboard: OK');
    } catch(e) { console.error('❌ GET /admin/analytics/dashboard:', e.message, e.response?.data); }

    try {
      const pqrRes = await axios.get(`${baseURL}/admin/pqr?limit=5`, { headers });
      console.log('✅ GET /admin/pqr: OK', pqrRes.data.data.length, 'registros.');
    } catch(e) { console.error('❌ GET /admin/pqr:', e.message, e.response?.data); }

    try {
      const resenasRes = await axios.get(`${baseURL}/admin/resenas?limit=5`, { headers });
      console.log('✅ GET /admin/resenas: OK', resenasRes.data.data?.length || 0, 'registros.');
    } catch(e) { console.error('❌ GET /admin/resenas:', e.message, e.response?.data); }

    try {
      const seoRes = await axios.get(`${baseURL}/admin/seo`, { headers });
      console.log('✅ GET /admin/seo: OK', seoRes.data.data?.length || 0, 'registros.');
    } catch(e) { console.error('❌ GET /admin/seo:', e.message, e.response?.data); }
    
  } catch (err) {
    console.error('Error Fatal en la prueba:', err.message);
    if(err.response) console.error(err.response.data);
  }
}

testServices();
