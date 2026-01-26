# 📧 Configuración de EmailJS con cPanel (SMTP)

Sigue estos pasos para conectar tu correo corporativo (cPanel/Roundcube) con el formulario de la web.

## Paso 1: Obtener datos SMTP en cPanel
1. Entra a tu **cPanel**.
2. Ve a la sección **Correo Electrónico** > **Cuentas de Correo**.
3. Busca tu correo (`gharasas@gharasas.com`) y dale clic en **"Connect Devices"** (Conectar Dispositivos).
4. Busca el cuadro azul que dice **"Secure SSL/TLS Settings"**.
   - Necesitarás estos datos:
     - **Username:** `gharasas@gharasas.com`
     - **Password:** (Tu contraseña del correo)
     - **Outgoing Server:** (Ej: `mail.gharasas.com`)
     - **SMTP Port:** (Casi siempre es `465`)

---

## Paso 2: Configurar en EmailJS
1. Crea tu cuenta gratis en [emailjs.com](https://www.emailjs.com/).
2. Ve a **Email Services** > **Add New Service**.
3. Selecciona **"SMTP Server"** (está abajo en la lista).
4. Llena el formulario con los datos del Paso 1:
   - **Name:** `Ghara SMTP`
   - **Service ID:** (Déjalo como está o ponle un nombre fácil)
   - **Host:** Tu Outgoing Server (ej: `mail.gharasas.com`)
   - **Port:** `465` (asegúrate que "Use SSL" esté marcado)
   - **Username:** `gharasas@gharasas.com`
   - **Password:** Tu contraseña del correo
5. Dale clic a **"Add Service"**.

---

## Paso 3: Crear la Plantilla
1. Ve a **Email Templates** > **Create New Template**.
2. Asunto: `Nueva Solicitud Web de {{name}}`
3. Cuerpo del mensaje:
   ```text
   Has recibido un nuevo mensaje desde la web de Ghara:
   
   Nombre: {{name}}
   Email: {{email}}
   Teléfono: {{phone}}
   Interés: {{subject}}
   
   Mensaje:
   {{message}}
   ```
4. Guarda y copia el **Template ID** (ej: `template_a1b2c3d`).

---

## Paso 4: Conectar en el Código
1. Ve a **Account** y copia tu **Public Key**.
2. Abre el archivo `src/shared/components/ui/ContactModal.jsx`.
3. Busca estas líneas y pega tus datos:

```javascript
// REEMPLAZA ESTOS VALORES CON LOS DE TU EMAILJS
const serviceId = 'service_xxxxxxx'; // ID de tu servicio SMTP
const templateId = 'template_xxxxxxx'; // ID de tu plantilla
const publicKey = 'public_xxxxxxx'; // Tu Public Key
```

¡Listo! Ahora los correos saldrán desde tu servidor cPanel usando el formulario de la web.
