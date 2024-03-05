import {Database} from "bun:sqlite";
import {drizzle} from "drizzle-orm/bun-sqlite";
import {Certificates} from "./schema.ts";
import fs from 'node:fs';


const sqlite = new Database('../Certificates.sqlite');
const db = drizzle(sqlite);

const result = db.select()
    .from(Certificates)
    .all()

for (let certificate of result) {
    const oldPath = certificate.Directory + '/' + certificate.File + '.pdf'
    const outputDirectory = `Output/${certificate.Directory}/`;
    const newPath = `${certificate.Name}-(${certificate.Serial}).pdf`;

    try {
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, {recursive: true})
        }
        console.log("Renaming file %s to %s", oldPath, newPath);
        fs.renameSync(oldPath, outputDirectory + newPath);
    } catch (e) {
        console.error('Cannot rename the file %s, caused by: ', oldPath, e)
    }
}