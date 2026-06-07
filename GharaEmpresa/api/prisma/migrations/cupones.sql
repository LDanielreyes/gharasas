-- =============================================
-- GHARA SAS — Migración: Tablas de Cupones
-- Ejecutar en phpMyAdmin (cPanel) sobre la DB: gharasas_db
-- =============================================

-- Tabla: cupones
CREATE TABLE IF NOT EXISTS `cupones` (
    `id_cupon` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,
    `tipo_descuento` VARCHAR(20) NOT NULL,
    `valor_descuento` DECIMAL(12, 2) NOT NULL,
    `minimo_compra` DECIMAL(12, 2) NULL,
    `limite_usos` INTEGER NOT NULL DEFAULT 0,
    `usos_actuales` INTEGER NOT NULL DEFAULT 0,
    `fecha_inicio` DATETIME(3) NOT NULL,
    `fecha_expiracion` DATETIME(3) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cupones_codigo_key`(`codigo`),
    PRIMARY KEY (`id_cupon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla: usos_cupon
CREATE TABLE IF NOT EXISTS `usos_cupon` (
    `id_uso_cupon` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cupon` INTEGER NOT NULL,
    `id_venta` INTEGER NULL,
    `email_cliente` VARCHAR(150) NULL,
    `monto_ahorro` DECIMAL(12, 2) NOT NULL,
    `fecha_uso` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `usos_cupon_id_cupon_idx`(`id_cupon`),
    INDEX `usos_cupon_id_venta_idx`(`id_venta`),
    PRIMARY KEY (`id_uso_cupon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Key
ALTER TABLE `usos_cupon` ADD CONSTRAINT `usos_cupon_id_cupon_fkey` FOREIGN KEY (`id_cupon`) REFERENCES `cupones`(`id_cupon`) ON DELETE CASCADE ON UPDATE CASCADE;
