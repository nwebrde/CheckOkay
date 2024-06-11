ALTER TABLE bwell_notificationChannel modify id int(11);--> statement-breakpoint
ALTER TABLE `bwell_notificationChannel` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `bwell_notificationChannel` ADD PRIMARY KEY(`userId`,`address`);--> statement-breakpoint
ALTER TABLE `bwell_notificationChannel` DROP COLUMN `id`;