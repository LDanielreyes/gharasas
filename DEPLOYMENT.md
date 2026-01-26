# Ghara - Aires Acondicionados

Sitio web oficial de Ghara - Especialistas en climatización HVAC en Barranquilla, Colombia.

## 🌐 Deployment

**Dominio:** gharasas.com  
**Status:** Production Ready

## 📋 Configuración del Dominio

### Vercel (Recomendado)

1. **Deploy desde GitHub:**
   ```bash
   # Conectar repo en Vercel Dashboard
   https://vercel.com/new
   ```

2. **Configurar dominio custom:**
   - Agregar `gharasas.com` en Project Settings > Domains
   - Configurar DNS records:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

3. **Variables de entorno:**
   - `VITE_GA_ID`: G-XXXXXXXXXX (reemplazar con tu Google Analytics ID)

### Netlify (Alternativa)

1. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

2. **Configurar dominio:**
   - DNS Settings > Add custom domain: `gharasas.com`
   - Netlify DNS nameservers:
     ```
     dns1.p05.nsone.net
     dns2.p05.nsone.net
     dns3.p05.nsone.net
     dns4.p05.nsone.net
     ```

## 🔧 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production
npm run preview
```

## 📊 Google Analytics

1. Crear proyecto en: https://analytics.google.com
2. Obtener Measurement ID (G-XXXXXXXXXX)
3. Reemplazar en `index.html` línea 93

## ✅ Pre-deployment Checklist

- [x] WhatsApp número real: 302 232 6569
- [x] Dirección mapa correcta
- [x] SEO meta tags completos
- [ ] Google Analytics ID configurado
- [ ] Dominio gharasas.com configurado
- [ ] SSL/HTTPS habilitado (automático en Vercel/Netlify)

## 📞 Contacto

**Teléfono:** +57 302 232 6569  
**Dirección:** Cra. 27 #68b-105, Suroccidente, Barranquilla  
**WhatsApp:** https://wa.me/573022326569

---

**Desarrollado por:** LDanielreyes  
**Versión:** 1.0.0
