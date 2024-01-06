import * as AWS from 'aws-sdk'
import * as nodemailer from 'nodemailer'
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
const transporter = nodemailer.createTransport({
    SES: ses,
})
export const sendWarning = async (
    toMail: string,
    guardUser: string,
    guardedUser: string,
    lastCheck: string,
) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.FROM_MAIL,
            to: toMail,
            subject: guardedUser + ' reagiert nicht mehr',
            html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div style="padding:20px;">
<div style="max-width: 500px;">
<h2>${guardedUser} reagiert nicht mehr</h2>
<p>
Hallo ${guardUser},<br/><br/>
es scheint ein Problem bei ${guardedUser} zu geben. ${guardedUser} hat nicht auf eine Statusabfrage reagiert.<br/><br/>
Die letzte Reaktion fand am ${lastCheck} statt.
</p>
</div>
</div>
</body>
</html>
`,
        })
        return response?.messageId
    } catch (error) {
        return false
    }
}

export const sendReminder = async (
    toMail: string,
    guardedUser: string,
    nextCheck: string,
) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.FROM_MAIL,
            to: toMail,
            subject: 'Ist alles okay?',
            html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div style="padding:20px;">
<div style="max-width: 500px;">
<h2>Ist alles okay?</h2>
<p>
Hallo ${guardedUser},<br/><br/>
denke bitte dran die Frage in spätestens ${nextCheck} zu beantworten.
</p>
</div>
</div>
</body>
</html>
`,
        })
        return response?.messageId
    } catch (error) {
        return false
    }
}

export const sendNewGuard = async (
    toMail: string,
    guardUser: string,
    guardedUser: string,
) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.FROM_MAIL,
            to: toMail,
            subject: guardUser + ' passt jetzt auf dich auf',
            html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div style="padding:20px;">
<div style="max-width: 500px;">
<h2>${guardUser} passt auf dich auf</h2>
<p>
Hallo ${guardedUser},<br/><br/>
ab sofort benachrichtigen wir ${guardUser} falls du nicht rechtzeitig auf Statusabfragen reagierst.<br/><br/>
Du möchtest das nicht? In der App kannst du jederzeit ${guardUser} aus der Liste deiner Guards entfernen.
</p>
</div>
</div>
</body>
</html>
`,
        })
        return response?.messageId
    } catch (error) {
        return false
    }
}
