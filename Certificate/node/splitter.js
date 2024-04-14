#!/usr/bin/env node

import muhammara from 'muhammara'
import fs from 'node:fs'
import {readdir} from 'node:fs/promises'
import {resolve, basename} from "node:path";

// Ref: https://stackoverflow.com/a/45130990
async function* getFiles(dir) {
    const dirents = await readdir(dir, {withFileTypes: true});
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
}


(async () => {
    for await (const file of getFiles('pdf/')) {
        console.log('Processing the template file %s', file)

        const basenameOfFile = basename(file).replace('.pdf', '')
        const objDumpOfSeparatedFiles = `obj/${basenameOfFile}`;

        const reader = muhammara.createReader(file)
        const pages = reader.getPagesCount();

        fs.mkdirSync(objDumpOfSeparatedFiles, {
            recursive: true
        })

        for (let i = 1; i <= pages; i++) {
            console.log('Separated page %s', i)
            const writer = muhammara.createWriter(`${objDumpOfSeparatedFiles}/Output${i}.pdf`)
            writer.createPDFCopyingContext(reader).appendPDFPageFromPDF(i - 1);
            writer.end();
        }
    }
})()

