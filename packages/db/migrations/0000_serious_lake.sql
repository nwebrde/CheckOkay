CREATE TABLE `bwell_account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `bwell_account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `bwell_session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `bwell_session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `bwell_user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`image` varchar(255),
	`nextRequiredCheckDate` datetime,
	`lastManualCheck` datetime,
	`lastStepCheck` datetime,
	`state` enum('OK','WARNED','BACKUP','NOTIFIED') NOT NULL DEFAULT 'OK',
	`notifyBackupAfter` time NOT NULL DEFAULT '03:00' CHECK (HOUR(notifyBackupAfter) < 24),
	`reminderBeforeCheck` time NOT NULL DEFAULT '00:25' CHECK (HOUR(reminderBeforeCheck) < 24),
	CONSTRAINT `bwell_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bwell_verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `bwell_verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `bwell_checks` (
	`guardedUserId` varchar(255) NOT NULL,
	`time` time NOT NULL DEFAULT '00:00' CHECK (HOUR(time) < 24),
	`id` varchar(255) NOT NULL,
	`notifyId` varchar(255),
	`backupId` varchar(255),
	CONSTRAINT `bwell_checks_guardedUserId_time_pk` PRIMARY KEY(`guardedUserId`,`time`),
	CONSTRAINT `bwell_checks_id_unique` UNIQUE(`id`),
	CONSTRAINT `bwell_checks_notifyId_unique` UNIQUE(`notifyId`),
	CONSTRAINT `bwell_checks_backupId_unique` UNIQUE(`backupId`)
);
--> statement-breakpoint
CREATE TABLE `bwell_guards` (
	`guardedUserId` varchar(255) NOT NULL,
	`guardUserId` varchar(255) NOT NULL,
	`priority` enum('important','backup') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bwell_guards_guardUserId_guardedUserId_pk` PRIMARY KEY(`guardUserId`,`guardedUserId`)
);
--> statement-breakpoint
CREATE TABLE `bwell_invitations` (
	`code` varchar(255) NOT NULL,
	`guardedUserId` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bwell_invitations_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `bwell_authCodes` (
	`authCode` varchar(255) NOT NULL,
	`clientId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`scope` varchar(255) NOT NULL DEFAULT 'all',
	`codeChallenge` varchar(255) NOT NULL,
	`codeChallengeMethod` enum('plain','S256') NOT NULL,
	`redirectUri` varchar(255),
	`issuedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `bwell_authCodes_authCode` PRIMARY KEY(`authCode`)
);
--> statement-breakpoint
CREATE TABLE `bwell_refreshTokens` (
	`refreshToken` varchar(255) NOT NULL,
	`clientId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`scope` varchar(255) NOT NULL DEFAULT 'all',
	`issuedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `bwell_refreshTokens_refreshToken` PRIMARY KEY(`refreshToken`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `bwell_account` (`userId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `bwell_session` (`userId`);--> statement-breakpoint
ALTER TABLE `bwell_checks` ADD CONSTRAINT `bwell_checks_guardedUserId_bwell_user_id_fk` FOREIGN KEY (`guardedUserId`) REFERENCES `bwell_user`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bwell_guards` ADD CONSTRAINT `bwell_guards_guardedUserId_bwell_user_id_fk` FOREIGN KEY (`guardedUserId`) REFERENCES `bwell_user`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bwell_guards` ADD CONSTRAINT `bwell_guards_guardUserId_bwell_user_id_fk` FOREIGN KEY (`guardUserId`) REFERENCES `bwell_user`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bwell_invitations` ADD CONSTRAINT `bwell_invitations_guardedUserId_bwell_user_id_fk` FOREIGN KEY (`guardedUserId`) REFERENCES `bwell_user`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bwell_authCodes` ADD CONSTRAINT `bwell_authCodes_userId_bwell_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `bwell_user`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bwell_refreshTokens` ADD CONSTRAINT `bwell_refreshTokens_userId_bwell_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `bwell_user`(`id`) ON DELETE cascade ON UPDATE cascade;