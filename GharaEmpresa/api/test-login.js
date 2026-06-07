const axios = require('axios');
axios.post('http://localhost:3001/api/auth/login', {
  email: 'admin@gharasas.com',
  password: 'GharaAdmin2026!'
})
.then(r => console.log('Exito:', Object.keys(r.data.data)))
.catch(e => console.log('Error:', e.response?.data || e.message));
