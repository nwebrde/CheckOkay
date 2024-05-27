ALTER TABLE `bwell_notificationChannel` MODIFY COLUMN `type` enum('EMAIL','PUSH') NOT NULL;--> statement-breakpoint
ALTER TABLE `bwell_user` DROP COLUMN `notified`;--> statement-breakpoint
ALTER TABLE `bwell_user` DROP COLUMN `warned`;--> statement-breakpoint
ALTER TABLE `bwell_user` DROP COLUMN `warnedBackup`;