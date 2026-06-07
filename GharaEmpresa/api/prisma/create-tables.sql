-- ==========================================
-- GHARA SAS — MySQL Schema (cPanel)
-- Ejecutar en phpMyAdmin o vía SSH:
--   mysql -u gharasas_wp637 -p gharasas_db < create-tables.sql
-- ==========================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ─── 1. CATÁLOGO ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS `marcas` (
  `id_marca` INT NOT NULL AUTO_INCREMENT,
  `nombre`   VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_marca`),
  UNIQUE KEY `uq_marcas_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto`       INT NOT NULL AUTO_INCREMENT,
  `id_marca`          INT NOT NULL,
  `modelo`            VARCHAR(150) NOT NULL,
  `tecnologia`        VARCHAR(50)  NOT NULL,
  `linea_serie`       VARCHAR(100) DEFAULT NULL,
  `capacidad_btu`     INT          NOT NULL,
  `voltaje`           VARCHAR(20)  NOT NULL,
  `refrigerante`      VARCHAR(20)  DEFAULT NULL,
  `seer`              DECIMAL(4,2) DEFAULT NULL,
  `clase_energetica`  VARCHAR(5)   DEFAULT NULL,
  `tiene_wifi`        TINYINT(1)   NOT NULL DEFAULT 0,
  `color`             VARCHAR(30)  NOT NULL DEFAULT 'Blanco',
  `precio_contado`    DECIMAL(12,2) NOT NULL,
  `estado_inventario` VARCHAR(50)  NOT NULL DEFAULT 'DISPONIBLES',
  `estado_registro`   TINYINT(1)   NOT NULL DEFAULT 1,
  `fecha_creacion`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  -- SEO
  `slug`              VARCHAR(200) DEFAULT NULL,
  `meta_titulo`       VARCHAR(70)  DEFAULT NULL,
  `meta_descripcion`  VARCHAR(160) DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `uq_productos_slug` (`slug`),
  KEY `idx_productos_marca` (`id_marca`),
  CONSTRAINT `fk_productos_marca` FOREIGN KEY (`id_marca`)
    REFERENCES `marcas` (`id_marca`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `imagenes_producto` (
  `id_imagen`    INT NOT NULL AUTO_INCREMENT,
  `id_producto`  INT NOT NULL,
  `ruta_imagen`  VARCHAR(255) NOT NULL,
  `es_principal` TINYINT(1)   NOT NULL DEFAULT 0,
  `orden`        INT          NOT NULL DEFAULT 0,
  `fecha_subida` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id_imagen`),
  KEY `idx_imagenes_producto` (`id_producto`),
  CONSTRAINT `fk_imagenes_producto` FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. INTERACCIÓN ANÓNIMA ──────────────────────────

CREATE TABLE IF NOT EXISTS `resenas` (
  `id_resena`         INT NOT NULL AUTO_INCREMENT,
  `id_producto`       INT NOT NULL,
  `alias_autor`       VARCHAR(50)  NOT NULL DEFAULT 'Anónimo',
  `calificacion`      INT          NOT NULL,
  `comentario`        TEXT         DEFAULT NULL,
  `estado_moderacion` VARCHAR(20)  NOT NULL DEFAULT 'Pendiente',
  `fecha_resena`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id_resena`),
  KEY `idx_resenas_producto` (`id_producto`),
  CONSTRAINT `fk_resenas_producto` FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `preguntas_respuestas` (
  `id_pregunta`      INT NOT NULL AUTO_INCREMENT,
  `id_producto`      INT NOT NULL,
  `alias_autor`      VARCHAR(50)  NOT NULL DEFAULT 'Anónimo',
  `pregunta`         TEXT         NOT NULL,
  `respuesta`        TEXT         DEFAULT NULL,
  `fecha_pregunta`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `fecha_respuesta`  DATETIME(3)  DEFAULT NULL,
  PRIMARY KEY (`id_pregunta`),
  KEY `idx_preguntas_producto` (`id_producto`),
  CONSTRAINT `fk_preguntas_producto` FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. ANALÍTICAS WEB ──────────────────────────────

CREATE TABLE IF NOT EXISTS `vistas_producto` (
  `id_vista`        INT NOT NULL AUTO_INCREMENT,
  `id_producto`     INT NOT NULL,
  `fecha_vista`     DATE NOT NULL,
  `cantidad_vistas` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_vista`),
  UNIQUE KEY `uq_vistas_producto_fecha` (`id_producto`, `fecha_vista`),
  CONSTRAINT `fk_vistas_producto` FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 4. CRM Y CONVERSIÓN ────────────────────────────

CREATE TABLE IF NOT EXISTS `clientes` (
  `id_cliente`       INT NOT NULL AUTO_INCREMENT,
  `nombre_completo`  VARCHAR(150) NOT NULL,
  `telefono`         VARCHAR(20)  DEFAULT NULL,
  `email`            VARCHAR(150) DEFAULT NULL,
  `fecha_registro`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `leads_contacto` (
  `id_lead`        INT NOT NULL AUTO_INCREMENT,
  `id_producto`    INT          DEFAULT NULL,
  `canal_contacto` VARCHAR(50)  NOT NULL DEFAULT 'WhatsApp',
  `utm_source`     VARCHAR(100) DEFAULT NULL,
  `utm_medium`     VARCHAR(100) DEFAULT NULL,
  `utm_campaign`   VARCHAR(150) DEFAULT NULL,
  `fecha_contacto` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id_lead`),
  KEY `idx_leads_producto` (`id_producto`),
  CONSTRAINT `fk_leads_producto` FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ventas` (
  `id_venta`         INT NOT NULL AUTO_INCREMENT,
  `id_cliente`       INT            DEFAULT NULL,
  `total`            DECIMAL(12, 2) NOT NULL,
  `canal_cierre`     VARCHAR(50)    NOT NULL DEFAULT 'WhatsApp',
  `estado_venta`     VARCHAR(50)    NOT NULL DEFAULT 'COMPLETADA',
  `estado_registro`  TINYINT(1)     NOT NULL DEFAULT 1,
  `fecha_venta`      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id_venta`),
  KEY `idx_ventas_cliente` (`id_cliente`),
  CONSTRAINT `fk_ventas_cliente` FOREIGN KEY (`id_cliente`)
    REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `detalles_venta` (
  `id_detalle`       INT NOT NULL AUTO_INCREMENT,
  `id_venta`         INT NOT NULL,
  `id_producto`      INT NOT NULL,
  `cantidad`         INT NOT NULL,
  `precio_unitario`  DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `idx_detalles_venta` (`id_venta`),
  KEY `idx_detalles_producto` (`id_producto`),
  CONSTRAINT `fk_detalles_venta_venta` FOREIGN KEY (`id_venta`)
    REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detalles_venta_producto` FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 5. ATENCIÓN AL CLIENTE ──────────────────────────

CREATE TABLE IF NOT EXISTS `preguntas_frecuentes` (
  `id_faq`               INT NOT NULL AUTO_INCREMENT,
  `categoria`            VARCHAR(50)  NOT NULL,
  `pregunta`             VARCHAR(255) NOT NULL,
  `respuesta`            TEXT         NOT NULL,
  `orden_visualizacion`  INT          NOT NULL DEFAULT 0,
  `estado_publicacion`   TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_faq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pqr_contactos` (
  `id_pqr`                     INT NOT NULL AUTO_INCREMENT,
  `radicado`                   VARCHAR(20)  NOT NULL,
  `tipo_solicitud`             VARCHAR(20)  NOT NULL,
  `nombre_remitente`           VARCHAR(150) NOT NULL,
  `email_remitente`            VARCHAR(150) NOT NULL,
  `telefono_remitente`         VARCHAR(20)  NOT NULL,
  `asunto`                     VARCHAR(150) NOT NULL,
  `mensaje`                    TEXT         NOT NULL,
  `id_venta`                   INT          DEFAULT NULL,
  `estado_ticket`              VARCHAR(20)  NOT NULL DEFAULT 'Abierto',
  `respuesta_equipo_gharasas`  TEXT         DEFAULT NULL,
  `acepto_habeas_data`         TINYINT(1)   NOT NULL DEFAULT 0,
  `fecha_radicado`             DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `fecha_resolucion`           DATETIME(3)  DEFAULT NULL,
  PRIMARY KEY (`id_pqr`),
  UNIQUE KEY `uq_pqr_radicado` (`radicado`),
  KEY `idx_pqr_venta` (`id_venta`),
  CONSTRAINT `fk_pqr_venta` FOREIGN KEY (`id_venta`)
    REFERENCES `ventas` (`id_venta`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 6. ADMIN USUARIOS ──────────────────────────────

CREATE TABLE IF NOT EXISTS `admin_usuarios` (
  `id_admin`      INT NOT NULL AUTO_INCREMENT,
  `nombre`        VARCHAR(100) NOT NULL,
  `email`         VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol`           VARCHAR(50)  NOT NULL DEFAULT 'Asesor',
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `uq_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── SEED: Datos iniciales ──────────────────────────

-- Marcas
INSERT IGNORE INTO `marcas` (`nombre`) VALUES
  ('MIRAGE'), ('HISENSE'), ('MIDEA'), ('PANASONIC'), ('MABE');

-- Admin SuperAdmin (password: GharaAdmin2026!)
-- bcrypt hash generado con 12 rounds
INSERT IGNORE INTO `admin_usuarios` (`nombre`, `email`, `password_hash`, `rol`) VALUES
  ('Administrador Ghara', 'admin@gharasas.com',
   '$2b$12$3j203o7C4DO.wne0wPnUmu3fxMucCL5Hfi0pifApNjpq6Xwb2iipC',
   'SuperAdmin');

-- FAQ iniciales
INSERT IGNORE INTO `preguntas_frecuentes` (`categoria`, `pregunta`, `respuesta`, `orden_visualizacion`) VALUES
  ('Compra', '¿Cómo puedo comprar un aire acondicionado?',
   'Puedes explorar nuestro catálogo en línea, seleccionar el equipo ideal y hacer clic en "Comprar por WhatsApp" para contactar a un asesor comercial.', 1),
  ('Instalación', '¿El precio incluye instalación?',
   'La instalación tiene un costo adicional que depende de las condiciones del espacio. Nuestros asesores te darán una cotización personalizada.', 2),
  ('Garantía', '¿Qué garantía tienen los equipos?',
   'Todos nuestros equipos cuentan con garantía directa del fabricante, que varía entre 1 y 5 años según la marca y el componente.', 3),
  ('Envío', '¿Realizan envíos a otras ciudades?',
   'Sí, realizamos envíos a nivel nacional. El costo y tiempo de entrega varían según la ciudad destino.', 4);
