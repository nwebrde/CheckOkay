import {send} from "../../adapters/notificationChannels/email";
import {Recipient, Notification} from "../../entities/notifications/Notifications";

// TODO: Je nach Notification Klasse muss vor dem senden geprüft werden
// TODO: Retry Push
export const sendMail = async (toMail: string, recipient: Recipient, notification: Notification) => {
    await send(toMail, recipient, notification)
}