import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const info = await transporter.sendMail({
    from: 'logistica@residuosambientales.com',
    to: 'adan@grr.la',
    subject: 'Residuos',
    html: `<strong>Hi Residuos</strong>`,
})

console.log('Message sent: %s', info.messageId)