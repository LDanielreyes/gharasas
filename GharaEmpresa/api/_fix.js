const fs = require('fs');
const f = 'src/controllers/admin/usuarios.controller.js';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("require('../../../config/logger')", "require('../../config/logger')");
fs.writeFileSync(f, c);
console.log('Fixed');
