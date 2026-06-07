fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@gharasas.com', password: 'GharaAdmin2026!' })
})
.then(res => res.json())
.then(data => console.log('Login Response:', data))
.catch(err => console.error('Error:', err));
