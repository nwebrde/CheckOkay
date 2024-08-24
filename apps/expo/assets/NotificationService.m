#import "NotificationService.h"

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

                // Mögliche Strukturen für `data` prüfen
                NSString *criticalAlert = request.content.userInfo[@"body"][@"criticalAlert"];
                NSString *timeSensitive = request.content.userInfo[@"body"][@"timeSensitive"];

        if ([criticalAlert isEqual: @"1"]) {
            // Beispiel: Setzen des Titels der Benachrichtigung mit dem gefundenen Wert
            NSString *customSoundName = @"criticalAlert.caf"; // Name der Sounddatei

                UNNotificationSound *criticalSound = [UNNotificationSound soundNamed:customSoundName];

                // Critical Sound hinzufügen
                if (@available(iOS 15.0, *)) {
                    criticalSound = [UNNotificationSound criticalSoundNamed:customSoundName withAudioVolume:1.0];
                    self.bestAttemptContent.sound = criticalSound;
                }
        }
        if ([timeSensitive isEqual: @"1"]) {
        // Setze das Interruption Level auf "time-sensitive"
            if (@available(iOS 15.0, *)) {
                self.bestAttemptContent.interruptionLevel = UNNotificationInterruptionLevelTimeSensitive;
            }
            }

    self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    self.contentHandler(self.bestAttemptContent);
}

@end