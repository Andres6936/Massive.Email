import nodemailer from 'nodemailer';
import {drizzle} from 'drizzle-orm/bun-sqlite';
import {Database} from 'bun:sqlite';
import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {renderAsync} from "@react-email/render";
import {Email} from "./email.tsx";
import {eq, isNull} from "drizzle-orm";
import type {Attachment} from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

async function sendEmail(to: string, attachments: Attachment[]) {
    const emails = to.split(';')

    const info = await transporter.sendMail({
        from: 'logistica@residuosambientales.com',
        to: emails,
        cc: 'logistica@residuosambientales.com',
        subject: 'CERTIFICADOS DE DISPOSICIÓN FINAL - ENERO 2024 - RE-AM',
        html: await renderAsync(Email()),
        attachments: attachments,
    })

    console.log('Message sent with id: %s and response %s', info.messageId, info.response)

    return {
        MessageId: info.messageId,
        ResponseMessage: info.response,
    }
}


const Certificates = sqliteTable('Certificates', {
    Serial: integer('Serial').primaryKey({autoIncrement: true}),
    Directory: text('Directory').notNull(),
    Name: text('Name').notNull(),
    Email: text('Email').notNull(),
    File: text('File').notNull(),
    MessageId: text('MessageId'),
    ResponseMessage: text('ResponseMessage'),
});

const sqlite = new Database('../Certificates.sqlite');
const db = drizzle(sqlite);

const result = db.select()
    .from(Certificates)
    .where(isNull(Certificates.MessageId))
    .all()

for (let certificate of result) {
    try {
        const path = certificate.Directory + '/' + certificate.File + '.pdf'
        console.log("Sending email to (%s) with attachment: %s", certificate.Name, path)

        const buffer = []
        const streamFile = Bun.file(path).stream();
        for await (const data of streamFile) {
            buffer.push(data);
        }

        const responseMailer = await sendEmail(certificate.Email, [{
            filename: certificate.Name + '.pdf',
            content: Buffer.concat(buffer),
        }]);

        console.log('Successful sent message, updating register with information of message sent')
        await db.update(Certificates)
            .set({
                MessageId: responseMailer.MessageId,
                ResponseMessage: responseMailer.ResponseMessage
            })
            .where(eq(Certificates.Serial, certificate.Serial));

        // Wait two seconds for send a new email
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
        console.error('Cannot send email to user (%s) with email: %s, caused by: ', certificate.Name, certificate.Email, e)
    }
}