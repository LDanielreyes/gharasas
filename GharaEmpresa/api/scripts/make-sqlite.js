const fs = require('fs');
let s = fs.readFileSync('prisma/schema.prisma', 'utf8');
s = s.replace(/provider\s*=\s*"mysql"/, 'provider = "sqlite"');
s = s.replace(/url\s*=\s*env\("DATABASE_URL"\)/, 'url = "file:./dev.db"');
// Remove MySQL specific attributes
s = s.replace(/@db\.[a-zA-Z]+(\([^)]*\))?/g, '');
fs.writeFileSync('prisma/schema.dev.prisma', s);
console.log('Schema converted to SQLite');
