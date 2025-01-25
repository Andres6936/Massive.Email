import nodemailer from 'nodemailer';
import {drizzle} from 'drizzle-orm/bun-sqlite';
import {Database} from 'bun:sqlite';
import {renderAsync} from "@react-email/render";
import Email from "./emails/email.tsx";
import {eq, isNull} from "drizzle-orm";
import type {Attachment} from "nodemailer/lib/mailer";
import {Certificates, People, type PeopleModel} from "./schema.ts";
import fs from "node:fs";
import pLimit from 'p-limit'
import os from 'node:os'
import {ConsoleTransport, LogLayer} from "loglayer";

const CURRENCY_LIMIT = os.cpus().length;
const YEAR_CERTIFICATES = 2024

const sqlite = new Database('../Certificates.sqlite');
const db = drizzle(sqlite);

const log = new LogLayer({
    transport: new ConsoleTransport({
        logger: console,
    }),
})

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: +process.env.SMTP_PORT!,
    secure: process.env.NODE_ENV === 'production',
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
    }
})

async function sendEmail(to: string, attachments: Attachment[], name: string, month: string) {
    const emails = to.split(';')

    const info = await transporter.sendMail({
        from: 'logistica@residuosambientales.com',
        to: emails,
        cc: ['logistica@residuosambientales.com', 'atencionalcliente@residuosambientales.com'],
        subject: `CERTIFICADOS DE DISPOSICIÓN FINAL - ${month} ${YEAR_CERTIFICATES} - RE-AM`,
        html: await renderAsync(Email({
            previewText: `CERTIFICADOS DE DISPOSICIÓN FINAL - ${month} ${YEAR_CERTIFICATES} - RE-AM`,
            name: name,
            month: month,
            year: YEAR_CERTIFICATES,
        })),
        attachments: attachments,
    })

    log.info('Message sent with id: %s and response %s', info.messageId, info.response)

    return {
        MessageId: info.messageId,
        ResponseMessage: info.response,
    }
}

async function getAttachmentFromPath(filename: string, path: string): Promise<Attachment> {
    const buffer = []
    const streamFile = Bun.file(path).stream();
    for await (const data of streamFile) {
        buffer.push(data);
    }

    return {
        filename: filename,
        content: Buffer.concat(buffer)
    };
}

async function processEntity(entity: PeopleModel) {
    const directoryAndFiles = db.select()
        .from(Certificates)
        .where(eq(Certificates.Name, entity.Name))
        .all()

    const pathOfCertificates = directoryAndFiles.map((x, index) => ({
        // Used for rename the file when the file is sent like attachment
        Name: `${x.Name}-(${index})-${x.Month}-${YEAR_CERTIFICATES}.pdf`,
        // Used for load the file from disk
        Path: x.Directory + '/Output' + x.File + '.pdf',
        // Used for load the file from the directory from disk
        Directory: x.Directory,
    }));

    const [firstName, ...restNames] = entity.Name!.split(' ');
    const shortName = firstName + ' ' + restNames.at(-1);
    log.withContext({T: shortName}).info('Loading attachment from path')

    const bufferOfCertificates = await Promise.all(pathOfCertificates.map(x =>
        getAttachmentFromPath(x.Name, x.Path)
    ));

    try {
        log.info("Sending email to (%s) with %s attachments", entity.Name, bufferOfCertificates.length)
        const responseMailer = await sendEmail(entity.Email, bufferOfCertificates, entity.Name!, entity.Month!);

        log.info('Successful sent message, updating register with information of message sent')
        await db.update(People)
            .set({
                MessageId: responseMailer.MessageId,
                ResponseMessage: responseMailer.ResponseMessage
            })
            .where(eq(People.Serial, entity.Serial));

        log.info("Moving files sent to new directory")
        for (let certificate of pathOfCertificates) {
            const outputDirectory = `Output/${certificate.Directory}/`;

            try {
                if (!fs.existsSync(outputDirectory)) {
                    fs.mkdirSync(outputDirectory, {recursive: true})
                }
                log.info("Renaming file %s to %s", certificate.Path, outputDirectory + certificate.Name);
                fs.renameSync(certificate.Path, outputDirectory + certificate.Name.replace('/', '-'));
            } catch (e) {
                log.withError(e).error('Cannot rename the file %s, caused by: ', certificate.Path)
            }
        }

        // Wait two seconds for send a new email
        await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (e) {
        log.withError(e).error('Cannot send email to user (%s) with email: %s, caused by: ', entity.Name, entity.Email)
    }
}


let entitiesToSendEmails;

do {
    entitiesToSendEmails = db.select()
        .from(People)
        .where(isNull(People.MessageId))
        .limit(180)
        .all()

    log.info(`Start splitting PDF files with ${CURRENCY_LIMIT} cores`)
    const limit = pLimit(CURRENCY_LIMIT);
    const promises = []

    for (let entity of entitiesToSendEmails) {
        promises.push(limit(() => processEntity(entity)));
    }

    await Promise.all(promises);

    // Wait for 1 hour
    await new Promise(resolve => setTimeout(resolve, 3_600_000));
} while (entitiesToSendEmails.length >= 0);