async function testServices() {
  try {
    // Importante usar la IPv4 directa para evitar problemas de resolución de localhost (::1 vs 127.0.0.1)
    const baseURL = 'http://127.0.0.1:3001/api';

    // Función helper para fetch
    const fetchApi = async (url, options = {}) => {
      const res = await fetch(`${baseURL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error HTTP ' + res.status);
      return data;
    };

    // 1. Iniciar sesión
    console.log('--- 1. Autenticación ---');
    const loginRes = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@gharasas.com', password: 'GharaAdmin2026!' })
    });
    const token = loginRes.data.accessToken;
    console.log('✅ Login Exitoso. Token Obtenido.');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n--- 2. Endpoints Públicos ---');
    try {
      const prodRes = await fetchApi('/productos');
      console.log('✅ GET /productos:', prodRes.data.length, 'productos obtenidos.');
    } catch(e) { console.error('❌ GET /productos:', e.message); }

    try {
      const faqRes = await fetchApi('/faq');
      console.log('✅ GET /faq     :', faqRes.data.length, 'FAQs obtenidos.');
    } catch(e) { console.error('❌ GET /faq     :', e.message); }

    console.log('\n--- 3. Endpoints Admin ---');
    try {
      const dashRes = await fetchApi('/admin/analytics/dashboard', { headers });
      console.log('✅ GET /admin/analytics/dashboard: OK - Tráfico =', dashRes.data.trafico.length);
    } catch(e) { console.error('❌ GET /admin/analytics/dashboard:', e.message); }

    try {
      const pqrRes = await fetchApi('/admin/pqr?limit=5', { headers });
      console.log('✅ GET /admin/pqr                : OK - Registros =', pqrRes.data.length);
    } catch(e) { console.error('❌ GET /admin/pqr                :', e.message); }

    try {
      const resenasRes = await fetchApi('/admin/resenas?limit=5', { headers });
      console.log('✅ GET /admin/resenas            : OK - Registros =', resenasRes.data?.length || 0);
    } catch(e) { console.error('❌ GET /admin/resenas            :', e.message); }

    try {
      const seoRes = await fetchApi('/admin/seo', { headers });
      console.log('✅ GET /admin/seo                : OK - Registros =', seoRes.data?.length || 0);
    } catch(e) { console.error('❌ GET /admin/seo                :', e.message); }

    try {
      const imgRes = await fetchApi('/admin/marcas', { headers });
      console.log('✅ GET /admin/marcas             : OK - Registros =', imgRes.data?.length || 0);
    } catch(e) { console.error('❌ GET /admin/marcas             :', e.message); }

  } catch (err) {
    console.error('❌ Error Fatal en la prueba:', err.message);
  }
}

testServices();
