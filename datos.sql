

-- 1.notificaciones 
CREATE TABLE IF NOT EXISTS `notificacion` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id_usuario` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_notificacion`),
  KEY `idx_usuario_notificacion` (`usuario_id_usuario`),
  CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2.
ALTER TABLE `metas_ahorro` ADD COLUMN `monto_actual` decimal(10,2) DEFAULT 0.00;

-- 3. bot
ALTER TABLE `interacciones_bot_finanzas`
MODIFY COLUMN `tipo` enum('CONSEJO','FAQ','CHAT_USUARIO','CHAT_BOT') NOT NULL;
