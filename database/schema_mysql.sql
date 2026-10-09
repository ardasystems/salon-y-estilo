-- ==============================================================================
-- SALÓN & ESTILO - MILUSKA VIDAURRE
-- SCHEMA DE BASE DE DATOS PARA HOSTING TRADICIONAL (MYSQL / MARIADB / CPANEL)
-- ==============================================================================
-- Compatible con MySQL 5.7+, MySQL 8.0+ y MariaDB 10.3+
-- Codificación: utf8mb4 (soporte completo de caracteres, tildes y emojis)
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABLA: CONFIGURACIÓN GENERAL DEL SALÓN
CREATE TABLE IF NOT EXISTS `store_settings` (
  `id` VARCHAR(50) NOT NULL DEFAULT 'current',
  `data` JSON NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABLA: CATÁLOGO DE PRODUCTOS
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `stock` INT NOT NULL DEFAULT 0,
  `data` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA: SERVICIOS PROFESIONALES DEL SALÓN
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `data` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_srv_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA: CASOS ANTES Y DESPUÉS
CREATE TABLE IF NOT EXISTS `comparison_cases` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `data` JSON NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA: ÓRDENES Y COMPRAS
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(50) NOT NULL,
  `customer` JSON DEFAULT NULL,
  `items` JSON DEFAULT NULL,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  `data` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_orders_status` (`payment_status`),
  INDEX `idx_orders_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABLA: LIBRO DE RECLAMACIONES
CREATE TABLE IF NOT EXISTS `complaints` (
  `id` VARCHAR(50) NOT NULL,
  `correlative` VARCHAR(50) NOT NULL,
  `data` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_correlative` (`correlative`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABLA: TRANSACCIONES Y CONCILIACIÓN DE MERCADO PAGO
CREATE TABLE IF NOT EXISTS `payment_transactions` (
  `id` VARCHAR(100) NOT NULL,
  `order_id` VARCHAR(50) DEFAULT NULL,
  `user_id` VARCHAR(255) DEFAULT NULL,
  `provider` VARCHAR(50) NOT NULL DEFAULT 'mercadopago',
  `plan_id` VARCHAR(100) DEFAULT 'salon_order',
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'PEN',
  `status` VARCHAR(50) NOT NULL,
  `status_detail` VARCHAR(100) DEFAULT NULL,
  `external_reference` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `activated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payment_provider_id` (`provider`, `id`),
  INDEX `idx_mp_order` (`order_id`),
  INDEX `idx_mp_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

