const nodemailer = require('nodemailer');
const logger = require('../config/logger');

let transporter;

function getTransporter() {
  if (!transporter) {
    // Si SMTP_USER no está configurado, no inicializar el transporter.
    if (!process.env.SMTP_USER || process.env.SMTP_USER.includes('<<<')) {
      return null;
    }
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return transporter;
}

/**
 * Envía email de confirmación de radicado PQR al remitente
 */
async function enviarConfirmacionPqr({ email, nombre, radicado, tipoSolicitud, asunto }) {
  try {
    const t = getTransporter();
    if (!t) {
      logger.warn('Email no enviado: SMTP_USER no configurado en .env', { service: 'ghara-api' });
      return;
    }
    const info = await t.sendMail({
      from: `"Ghara SAS" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: `Confirmación de radicado ${radicado} - Ghara SAS`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f2b46, #1a3a5c); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">GHARA SAS</h1>
            <p style="color: #8bb8d0; margin: 5px 0 0;">Climatización Profesional</p>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p>Estimado(a) <strong>${nombre}</strong>,</p>
            <p>Su solicitud ha sido radicada exitosamente en nuestro sistema.</p>
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0 0 8px;"><strong>Número de radicado:</strong> ${radicado}</p>
              <p style="margin: 0 0 8px;"><strong>Tipo:</strong> ${tipoSolicitud}</p>
              <p style="margin: 0;"><strong>Asunto:</strong> ${asunto}</p>
            </div>
            <p>De acuerdo con la normativa colombiana, le daremos respuesta dentro de los <strong>15 días hábiles</strong> siguientes a la fecha de radicación.</p>
            <p style="color: #6b7280; font-size: 13px;">Si tiene alguna pregunta adicional, puede comunicarse con nosotros a través de nuestros canales de atención.</p>
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Ghara SAS | Barranquilla & Cartagena, Colombia<br>
              <a href="https://www.gharasas.com" style="color: #0ea5e9;">www.gharasas.com</a>
            </p>
          </div>
        </div>
      `,
    });

    logger.info(`Email PQR enviado: ${radicado} → ${email}`, { messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error('Error enviando email PQR', {
      error: error.message,
      radicado,
      email,
    });
    // No lanzar error — el PQR ya se guardó en BD
    // El admin puede reenviar manualmente
  }
}

/**
 * Envía email con la resolución del PQR al remitente
 */
async function enviarResolucionPqr({ email, nombre, radicado, respuesta }) {
  try {
    const t = getTransporter();
    if (!t) {
      logger.warn('Email no enviado: SMTP_USER no configurado en .env', { service: 'ghara-api' });
      return;
    }
    const info = await t.sendMail({
      from: `"Ghara SAS" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: `Respuesta a su solicitud ${radicado} - Ghara SAS`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f2b46, #1a3a5c); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">GHARA SAS</h1>
            <p style="color: #8bb8d0; margin: 5px 0 0;">Respuesta a su solicitud</p>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p>Estimado(a) <strong>${nombre}</strong>,</p>
            <p>En referencia a su solicitud <strong>${radicado}</strong>, nos permitimos informarle:</p>
            <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; white-space: pre-line;">${respuesta}</p>
            </div>
            <p>Si requiere información adicional, no dude en contactarnos.</p>
            <p>Cordialmente,<br><strong>Equipo Ghara SAS</strong></p>
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Ghara SAS | Barranquilla & Cartagena, Colombia<br>
              <a href="https://www.gharasas.com" style="color: #0ea5e9;">www.gharasas.com</a>
            </p>
          </div>
        </div>
      `,
    });

    logger.info(`Email resolución enviada: ${radicado} → ${email}`, { messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error('Error enviando email resolución', {
      error: error.message,
      radicado,
      email,
    });
  }
}

module.exports = { enviarConfirmacionPqr, enviarResolucionPqr };
