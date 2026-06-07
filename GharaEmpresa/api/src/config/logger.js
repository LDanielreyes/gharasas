const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// Formato legible para desarrollo
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Formato JSON para producción (parseable)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Rotación diaria de archivos de error
const errorRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '10m',
  maxFiles: '14d', // Mantener logs por 14 días
  zippedArchive: true,
});

// Rotación diaria de todos los logs
const combinedRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d',
  zippedArchive: true,
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: prodFormat,
  defaultMeta: { service: 'ghara-api' },
  transports: [
    errorRotateTransport,
    combinedRotateTransport,
  ],
});

// En desarrollo, agregar consola con formato legible
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: devFormat,
    })
  );
}

module.exports = logger;
