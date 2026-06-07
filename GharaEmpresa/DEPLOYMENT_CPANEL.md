# Guía de Despliegue en cPanel — Ghara SAS

## Arquitectura de Despliegue

```
gharasas.com          → Frontend cliente (archivos estáticos)
admin.gharasas.com    → Panel admin (archivos estáticos)
api.gharasas.com      → Backend Node.js (cPanel Node.js App)
```

---

## Paso 1: Preparar la Base de Datos MySQL

La base de datos MySQL ya existe en cPanel (`gharasas_db`). Solo hay que asegurar que el esquema esté actualizado.

### Desde tu máquina local:
```bash
cd GharaEmpresa/api

# Editar .env con la DATABASE_URL de producción (apuntando al host remoto)
# Luego ejecutar:
npx prisma db push
npx prisma db seed
```

> **IMPORTANTE:** Después del seed, cambia inmediatamente la contraseña del admin (`GharaAdmin2026!`) desde el panel.

---

## Paso 2: Desplegar el Backend (API)

### 2.1 Crear la aplicación Node.js en cPanel

1. Ve a **cPanel → Setup Node.js App → Create Application**
2. Configura:
   - **Node.js version:** 20.x (LTS)
   - **Application mode:** Production
   - **Application root:** `GharaEmpresa/api`
   - **Application URL:** `api.gharasas.com`
   - **Application startup file:** `app.js`

3. Haz clic en **Create**

### 2.2 Subir archivos y configurar

1. Sube toda la carpeta `GharaEmpresa/api/` (sin `node_modules/`)
2. Copia `.env.production` como `.env` en el servidor:
   ```bash
   cp .env.production .env
   ```
3. Edita `.env` y rellena los valores reales:
   - `DATABASE_URL` con el usuario MySQL de cPanel (usualmente `usuario_cpanel@localhost`)
   - `JWT_SECRET` y `JWT_REFRESH_SECRET` — genera con:
     ```bash
     openssl rand -base64 64
     ```
   - `SMTP_*` — usa el correo de cPanel (mail.gharasas.com) o un servicio externo
   - `TURNSTILE_*` — obtener claves reales en https://dash.cloudflare.com/turnstile

4. Instala dependencias desde el terminal de cPanel:
   ```bash
   # Entrar al entorno virtual de Node.js (cPanel lo requiere)
   source /home/USUARIO/nodevenv/GharaEmpresa/api/20/bin/activate
   
   npm install --production
   npx prisma generate
   ```

5. Crea las carpetas de uploads con permisos:
   ```bash
   mkdir -p uploads/productos uploads/fichas
   chmod 755 uploads uploads/productos uploads/fichas
   ```

6. Reinicia la app desde cPanel → Setup Node.js App → **Restart**

### 2.3 Verificar
```bash
curl https://api.gharasas.com/api/health
# Debería responder: {"success":true,"message":"Ghara API en línea",...}
```

---

## Paso 3: Desplegar Frontend Cliente (gharasas)

### 3.1 Build de producción

Desde tu máquina local:
```bash
cd gharasas

# Vite usa .env.production automáticamente al hacer build
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos optimizados.

### 3.2 Subir a cPanel

1. Ve a **cPanel → File Manager**
2. Navega a `public_html/` (para el dominio principal `gharasas.com`)
3. Sube el **contenido** de la carpeta `dist/` (no la carpeta misma)
4. Crea un archivo `.htaccess` en `public_html/` para el SPA routing:

```apache
RewriteEngine On
RewriteBase /

# No reescribir archivos/directorios existentes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Redirigir todo a index.html (SPA)
RewriteRule ^(.*)$ /index.html [L]

# Compresión Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Cache de assets estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Headers de seguridad
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
```

---

## Paso 4: Desplegar Panel Admin

### 4.1 Build de producción

```bash
cd GharaEmpresa/admin

# Vite usa .env.production automáticamente al hacer build
npm run build
```

### 4.2 Subir a cPanel

1. En cPanel, crea un subdominio `admin.gharasas.com` apuntando a una carpeta (ej: `admin.gharasas.com/`)
2. Sube el **contenido** de `dist/` a esa carpeta
3. Crea el mismo `.htaccess` de SPA routing (copia el del paso 3.2)

---

## Paso 5: Configurar SSL

En **cPanel → SSL/TLS** o **Let's Encrypt**:
1. Genera certificados para:
   - `gharasas.com` y `www.gharasas.com`
   - `admin.gharasas.com`
   - `api.gharasas.com`
2. Si usas Cloudflare como DNS, el SSL se configura automáticamente.

---

## Paso 6: Verificación Post-Despliegue

### Checklist
- [ ] `https://gharasas.com` carga correctamente la landing page
- [ ] `https://gharasas.com/catalogo` muestra productos con imágenes
- [ ] Formulario de PQR / Servicios envía correctamente
- [ ] `https://admin.gharasas.com` muestra login y permite autenticar
- [ ] CRUD de productos funciona (crear, editar, subir imagen, subir ficha técnica)
- [ ] `https://api.gharasas.com/api/health` responde OK
- [ ] Los PDFs de fichas técnicas se descargan correctamente
- [ ] Cookie banner se muestra y respeta la decisión del usuario
- [ ] WhatsApp FAB abre conversación correctamente
- [ ] Google Analytics registra visitas (verificar en analytics.google.com)

### Comandos de diagnóstico
```bash
# Ver logs del API en tiempo real
tail -f GharaEmpresa/api/logs/combined-$(date +%Y-%m-%d).log

# Verificar que la carpeta uploads tiene permisos correctos
ls -la GharaEmpresa/api/uploads/

# Test rápido del API
curl -s https://api.gharasas.com/api/productos | head -c 200
```

---

## Troubleshooting Común en cPanel

| Problema | Solución |
|----------|----------|
| 502 Bad Gateway | Reiniciar la app Node.js desde cPanel |
| Imágenes no cargan | Verificar CORS_ORIGINS y permisos de `/uploads/` |
| CORS error en browser | Asegurar que el dominio del frontend está en `CORS_ORIGINS` |
| Login no funciona | Verificar que el seed se ejecutó y que JWT_SECRET es el mismo |
| Emails no llegan | Verificar credenciales SMTP en `.env` |
| Prisma error | Ejecutar `npx prisma generate` en el servidor |
