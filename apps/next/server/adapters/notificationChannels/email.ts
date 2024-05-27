import * as AWS from 'aws-sdk'
import * as nodemailer from 'nodemailer'
import {Notification, Recipient} from "../../entities/notifications/Notifications";

require('aws-sdk/lib/maintenance_mode_message').suppress = true;

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
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'eu-west-1',
    })
    AWS.config.getCredentials(function (error) {
        if (error) {
            console.log(error.stack)
        }
    })
    const ses = new AWS.SES({ apiVersion: '2010-12-01' })

// Create a transporter of nodemailer
    return nodemailer.createTransport({
        SES: ses,
    })
}



export const send = async (
    toMail: string,
    recipient: Recipient,
    notification: Notification
) => {
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
${notification.text}
</p>
</div>
</div>
</body>
</html>
`,
    })
    return response?.messageId
}