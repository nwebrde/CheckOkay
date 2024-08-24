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

    if ([criticalAlert isEqual: @"1"]) {
        NSString *customSoundName = @"criticalAlert.caf"; // Name der Sounddatei

        UNNotificationSound *criticalSound = [UNNotificationSound soundNamed:customSoundName];

        if (@available(iOS 15.0, *)) {
            criticalSound = [UNNotificationSound criticalSoundNamed:customSoundName withAudioVolume:1.0];
            self.bestAttemptContent.sound = criticalSound;
        }
    }
    else if ([timeSensitive isEqual: @"1"]) {
        if (@available(iOS 15.0, *)) {
            self.bestAttemptContent.interruptionLevel = UNNotificationInterruptionLevelTimeSensitive;
        }
    }


    NSString *profileImageUrlString = request.content.userInfo[@"body"][@"sender"][@"image"];
    NSString *name = request.content.userInfo[@"body"][@"sender"][@"name"];
    INImage *inImage = nil;

    // treat notification as a communication notification
    if(![name isEqual: @""] || ![profileImageUrlString isEqual: @""]) {
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

        UNNotificationContent* updatedContent = [self.bestAttemptContent contentByUpdatingWithProvider:intent error:nil];

        self.contentHandler(updatedContent);
    }
    else {
        self.contentHandler(self.bestAttemptContent);
    }



}

- (void)serviceExtensionTimeWillExpire {
    self.contentHandler(self.bestAttemptContent);
}

@end