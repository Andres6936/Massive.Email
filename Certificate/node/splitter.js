#!/usr/bin/env node

import muhammara from 'muhammara'
import fs from 'node:fs'
import util from 'node:util'
import {readdir} from 'node:fs/promises'
import {resolve, basename} from "node:path";
import {exec} from 'node:child_process';
import { LogLayer, ConsoleTransport } from 'loglayer'

const log = new LogLayer({
    transport: new ConsoleTransport({
        logger: console,
    }),
})

const execPromise = util.promisify(exec);

/**
 * Retrieves all files in a given directory and its subdirectories.
 *
 * @async
 * @generator
 * @param {string} dir - The directory path to retrieve files from.
 * @yield {string} The path of each file found.
 * @returns {AsyncIterable<string>} An async iterable that yields the path of each file found.
 */
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

const startTime = new Date().getTime();

(async () => {
    log.info("Start splitting PDF files")

    for await (const file of getFiles('pdf/')) {
        log.withMetadata({file}).info('Processing the template file')

        const basenameOfFile = basename(file).replace('.pdf', '')
        const objDumpOfSeparatedFiles = `obj/${basenameOfFile}`;

        const reader = muhammara.createReader(file)
        const pages = reader.getPagesCount();
        log.withMetadata({file}).info(`The total of pages to splitting is of ${pages}`)

        fs.mkdirSync(objDumpOfSeparatedFiles, {
            recursive: true
        })

        for (let i = 1; i <= pages; i++) {
            const startTime = new Date().getTime();
            const outputFilePath = `${objDumpOfSeparatedFiles}/Output${i}-temp.pdf`;
            const compressFilePath = `${objDumpOfSeparatedFiles}/Output${i}.pdf`;
            const writer = muhammara.createWriter(outputFilePath);
            writer.createPDFCopyingContext(reader).appendPDFPageFromPDF(i - 1);
            writer.end();

            await execPromise(`gsc -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${compressFilePath}" ${outputFilePath}`)
            fs.unlinkSync(outputFilePath);

            const endTime = new Date().getTime();
            const milliseconds = endTime - startTime;
            log.info(`The file ${i} was processed in ${milliseconds.toFixed(1)} ms`)
        }

        const endTime = new Date().getTime();
        const durationInSeconds = (endTime - startTime) / 1000;
        log.info(`The process took ${durationInSeconds.toFixed(1)} seconds`)
    }
})()

