#import "NotificationService.h"
#import <UserNotifications/UserNotifications.h>
#import <Intents/Intents.h>
#import <IntentsUI/INImage+IntentsUI.h>
#import <UIKit/UIKit.h>

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNNotificationRequest *receivedRequest;
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.receivedRequest = request;
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];

    NSString *criticalAlert = request.content.userInfo[@"body"][@"criticalAlert"];
    NSString *timeSensitive = request.content.userInfo[@"body"][@"timeSensitive"];

    if ([criticalAlert isEqualToString: @"1"]) {
        NSString *customSoundName = @"criticalalert.caf"; // Name der Sounddatei

        UNNotificationSound *criticalSound = [UNNotificationSound soundNamed:customSoundName];

        if (@available(iOS 15.0, *)) {
            criticalSound = [UNNotificationSound criticalSoundNamed:customSoundName withAudioVolume:0.7];
            self.bestAttemptContent.sound = criticalSound;
        }
    }
    else if ([timeSensitive isEqualToString: @"1"]) {
        if (@available(iOS 15.0, *)) {
            self.bestAttemptContent.interruptionLevel = UNNotificationInterruptionLevelTimeSensitive;
        }
    }


    NSString *profileImageUrlString = request.content.userInfo[@"body"][@"sender"][@"image"];
    NSString *name = request.content.userInfo[@"body"][@"sender"][@"name"];
    INImage *inImage = nil;

    UNNotificationContent* updatedContent = nil;

    // treat notification as a communication notification
    if(![name isEqualToString: @""] || ![profileImageUrlString isEqualToString: @""]) {
        if (profileImageUrlString && ![profileImageUrlString isEqual: @""]) {
            NSURL *profileImageUrl = [NSURL URLWithString:profileImageUrlString];
            NSData *imageData = [NSData dataWithContentsOfURL:profileImageUrl];
            inImage = [INImage imageWithImageData:imageData];
        }


        INPersonHandle *personHandle = [[INPersonHandle alloc] initWithValue:nil type:INPersonHandleTypeEmailAddress];
        INPerson *senderPerson = [[INPerson alloc] initWithPersonHandle:personHandle nameComponents:nil displayName:name image:inImage contactIdentifier:nil customIdentifier:nil];

        INSendMessageIntent *intent = [[INSendMessageIntent alloc] initWithRecipients:nil outgoingMessageType:1 content:nil speakableGroupName:nil conversationIdentifier:nil serviceName:nil sender:senderPerson attachments:nil];

        INInteraction *interaction = [[INInteraction alloc] initWithIntent:intent response:nil];
        interaction.direction = INInteractionDirectionIncoming;

        [interaction donateInteractionWithCompletion:^(NSError * _Nullable error) {
            if (error) {
                NSLog(@"Error donating interaction: %@", error);
            }
        }];

        updatedContent = [self.bestAttemptContent contentByUpdatingWithProvider:intent error:nil];
    }



    // dismiss warning notifications from tray
    if([request.content.userInfo[@"body"][@"categoryId"] isEqualToString: @"checkIn"]) {
        [[UNUserNotificationCenter currentNotificationCenter] getDeliveredNotificationsWithCompletionHandler:^(NSArray<UNNotification *> * _Nonnull notifications) {
                NSMutableArray *identifiersToDismiss = [NSMutableArray array];
                for (UNNotification *notification in notifications) {
                    NSString *categoryId = notification.request.content.userInfo[@"body"][@"categoryId"];
                    NSString *senderId = notification.request.content.userInfo[@"body"][@"sender"][@"id"];
                    if([categoryId isEqualToString: @"warning"]) {
                        if([senderId isEqualToString: request.content.userInfo[@"body"][@"sender"][@"id"]]) {
                            [identifiersToDismiss addObject:notification.request.identifier];
                        }
                    }
                }
                [[UNUserNotificationCenter currentNotificationCenter] removeDeliveredNotificationsWithIdentifiers:identifiersToDismiss];

                NSUserDefaults *sharedDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.de.nweber.checkokay.nse"];
                NSString *userId = [sharedDefaults objectForKey:@"userId"];
                NSString *initiatorId = request.content.userInfo[@"body"][@"sender"][@"initiatorId"];

                if ([userId isEqualToString:initiatorId]) {
                    self.contentHandler(nil);
                }

            if(updatedContent == nil) {
                self.contentHandler(self.bestAttemptContent);
            } else {
                self.contentHandler(updatedContent);
            }

            }];
    }
    else {
        if(updatedContent == nil) {
            self.contentHandler(self.bestAttemptContent);
        } else {
            self.contentHandler(updatedContent);
        }
    }
}

- (void)serviceExtensionTimeWillExpire {
    self.contentHandler(self.bestAttemptContent);
}

@end