/**
 * migrate-seo.js
 * Migración directa vía SQL para:
 *  1. Crear tabla `resenas` (si no existe)
 *  2. Agregar columnas SEO a `productos` (si no existen)
 *
 * Uso: node prisma/migrate-seo.js
 */
const { Client } = require('pg');
require('dotenv').config();

const SQL = `
  -- 1. Tabla resenas
  CREATE TABLE IF NOT EXISTS resenas (
    id_resena          SERIAL PRIMARY KEY,
    id_producto        INTEGER NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
    alias_autor        VARCHAR(100),
    nombre_referencia  VARCHAR(150),
    calificacion       INTEGER NOT NULL DEFAULT 5 CHECK (calificacion BETWEEN 1 AND 5),
    comentario         TEXT,
    estado_moderacion  VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    fecha_resena       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- 2. Columnas SEO en productos (IF NOT EXISTS equivalente con DO block)
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='productos' AND column_name='slug') THEN
      ALTER TABLE productos ADD COLUMN slug VARCHAR(200) UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='productos' AND column_name='meta_titulo') THEN
      ALTER TABLE productos ADD COLUMN meta_titulo VARCHAR(70);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='productos' AND column_name='meta_descripcion') THEN
      ALTER TABLE productos ADD COLUMN meta_descripcion VARCHAR(160);
    END IF;
  END $$;
`;

async function main() {
  const dbUrl = new URL(process.env.DATABASE_URL);
  const client = new Client({
    host:     dbUrl.hostname,
    port:     parseInt(dbUrl.port),
    database: dbUrl.pathname.replace('/', ''),
    user:     dbUrl.username,
    password: dbUrl.password,
    ssl:      { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  await client.connect();
  console.log('✅ Conectado a Clever Cloud PostgreSQL');

  await client.query(SQL);
  console.log('✅ Tabla `resenas` creada (o ya existía)');
  console.log('✅ Columnas SEO añadidas a `productos` (slug, meta_titulo, meta_descripcion)');

  await client.end();
  console.log('\n🎉 Migración completada exitosamente.');
}

main().catch(e => {
  console.error('❌ Error en migración:', e.message);
  process.exit(1);
});
