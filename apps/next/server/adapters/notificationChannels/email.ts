import * as nodemailer from 'nodemailer'
import {Notification, Recipient} from "../../entities/notifications/Notifications";
import { SendRawEmailCommand, SES } from '@aws-sdk/client-ses'


declare global {
    var transporter:
        nodemailer.Transporter | undefined
}

let transporter: nodemailer.Transporter;

if (process.env.NODE_ENV === 'production') {
    transporter = createTransporter();
}

else {
    if (!global.transporter) {
        global.transporter = createTransporter()
    }
    transporter = global.transporter!
}

function createTransporter(): nodemailer.Transporter {
    const client = new SES({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        },
        region: process.env.AWS_REGION, apiVersion: '2010-12-01'  });

// Create a transporter of nodemailer
    return nodemailer.createTransport({
        SES: {
            ses: client,
            aws: {
                SendRawEmailCommand
            }
        }

    })
}



export const send = async (
    toMail: string,
    recipient: Recipient,
    notification: Notification
) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.FROM_MAIL,
            to: toMail,
            subject: notification.subject,
            html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div style="padding:20px;">
<div style="max-width: 500px;">
<h2>${notification.subject}</h2>
<p>
Hi ${recipient.name},<br/><br/>
${(notification.mailOnlyText) ? notification.mailOnlyText : notification.text}
</p>
</div>
</div>
</body>
</html>
`,
        })
    } catch (e) {
        console.error(e);
        throw new Error("email delivery failed")
    }
}