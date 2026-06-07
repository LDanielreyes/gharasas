require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const logger = require('./src/config/logger');
const { errorHandler } = require('./src/middleware/errorHandler');

// Rutas Públicas
const authRoutes = require('./src/routes/admin/auth.routes');
const productosPublicRoutes = require('./src/routes/public/productos.routes');
const resenasPublicRoutes = require('./src/routes/public/resenas.routes');
const pqrPublicRoutes = require('./src/routes/public/pqr.routes');
const leadsPublicRoutes = require('./src/routes/public/leads.routes');
const vistasPublicRoutes = require('./src/routes/public/vistas.routes');
const faqPublicRoutes = require('./src/routes/public/faq.routes');
const promocionesPublicRoutes = require('./src/routes/public/promociones.routes');
const cuponesPublicRoutes = require('./src/routes/public/cupones.routes');
const descargablesPublicRoutes = require('./src/routes/public/descargables.routes');

// Rutas Admin
const marcasAdminRoutes = require('./src/routes/admin/marcas.routes');
const productosAdminRoutes = require('./src/routes/admin/productos.routes');
const imagenesAdminRoutes = require('./src/routes/admin/imagenes.routes');
const pqrAdminRoutes = require('./src/routes/admin/pqr.routes');
const analyticsAdminRoutes  = require('./src/routes/admin/analytics.routes');
const resenasAdminRoutes    = require('./src/routes/admin/resenas.routes');
const seoAdminRoutes        = require('./src/routes/admin/seo.routes');
const reportesAdminRoutes   = require('./src/routes/admin/reportes.routes');
const promocionesAdminRoutes = require('./src/routes/admin/promociones.routes');
const cuponesAdminRoutes = require('./src/routes/admin/cupones.routes');
const usuariosAdminRoutes = require('./src/routes/admin/usuarios.routes');
const descargablesAdminRoutes = require('./src/routes/admin/descargables.routes');
const faqAdminRoutes = require('./src/routes/admin/faq.routes');

const app = express();

// ==========================================
// 1. MIDDDLEWARES GLOBALES
// ==========================================

// Seguridad (Helmet + CSP)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://challenges.cloudflare.com", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://api.gharasas.com"],
      connectSrc: ["'self'", "https://api.gharasas.com", "https://challenges.cloudflare.com", "https://www.google-analytics.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["https://challenges.cloudflare.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    }
  }
}));

// CORS
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origin no permitido por CORS'));
    }
  },
  credentials: true
}));

// Parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ==========================================
// 2. ARCHIVOS ESTÁTICOS (Uploads)
// ==========================================
// Servir la carpeta de uploads para las imágenes de productos
// En cPanel esto lo manejaría Apache, pero en desarrollo Node necesita servirlo
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 3. RUTAS DE LA API
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Ghara API en línea', timestamp: new Date() });
});

// Rutas Públicas (Next.js)
app.use('/api/productos', productosPublicRoutes);
app.use('/api/resenas', resenasPublicRoutes);
app.use('/api/pqr', pqrPublicRoutes);
app.use('/api/leads', leadsPublicRoutes);
app.use('/api/vistas', vistasPublicRoutes);
app.use('/api/faq', faqPublicRoutes);
app.use('/api/promociones', promocionesPublicRoutes);
app.use('/api/cupones', cuponesPublicRoutes);
app.use('/api/descargables', descargablesPublicRoutes);

// Rutas Admin (React)
app.use('/api/auth', authRoutes);
app.use('/api/admin/marcas', marcasAdminRoutes);
app.use('/api/admin/productos', productosAdminRoutes);
app.use('/api/admin/imagenes', imagenesAdminRoutes);
app.use('/api/admin/pqr', pqrAdminRoutes);
app.use('/api/admin/analytics', analyticsAdminRoutes);
app.use('/api/admin/resenas',   resenasAdminRoutes);
app.use('/api/admin/seo',       seoAdminRoutes);
app.use('/api/admin/reportes',  reportesAdminRoutes);
app.use('/api/admin/promociones', promocionesAdminRoutes);
app.use('/api/admin/cupones', cuponesAdminRoutes);
app.use('/api/admin/usuarios', usuariosAdminRoutes);
app.use('/api/admin/descargables', descargablesAdminRoutes);
app.use('/api/admin/faq', faqAdminRoutes);

// ==========================================
// 4. MANEJO DE ERRORES Y 404
// ==========================================

// Sitemap
app.use('/sitemap.xml', require('./src/routes/public/sitemap.routes'));

// 404 No encontrado
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Endpoint no encontrado' });
});

// Global Error Handler
app.use(errorHandler);

// ==========================================
// 5. INICIAR SERVIDOR
// ==========================================
// Validación de seguridad de JWT en producción (B-01)
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    logger.error('FATAL: JWT_SECRET debe tener al menos 32 caracteres en producción');
    process.exit(1);
  }
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
    logger.error('FATAL: JWT_REFRESH_SECRET debe tener al menos 32 caracteres en producción');
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
  logger.info(`Entorno: ${process.env.NODE_ENV}`);
});

module.exports = app;
