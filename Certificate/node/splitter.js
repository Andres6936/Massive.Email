#!/usr/bin/env node

import muhammara from 'muhammara'
import fs from 'node:fs'
import util from 'node:util'
import {readdir} from 'node:fs/promises'
import {resolve, basename} from "node:path";
import {exec} from 'node:child_process';

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


(async () => {
    console.log("Start splitting PDF files")

    for await (const file of getFiles('pdf/')) {
        console.log('Processing the template file %s', file)

        const basenameOfFile = basename(file).replace('.pdf', '')
        const objDumpOfSeparatedFiles = `obj/${basenameOfFile}`;

        const reader = muhammara.createReader(file)
        const pages = reader.getPagesCount();
        console.log(`The total of pages to splitting is of ${pages} for the file: ${file}`)

        fs.mkdirSync(objDumpOfSeparatedFiles, {
            recursive: true
        })

        for (let i = 1; i <= pages; i++) {
            const outputFilePath = `${objDumpOfSeparatedFiles}/Output${i}-temp.pdf`;
            const compressFilePath = `${objDumpOfSeparatedFiles}/Output${i}.pdf`;
            const writer = muhammara.createWriter(outputFilePath);
            writer.createPDFCopyingContext(reader).appendPDFPageFromPDF(i - 1);
            writer.end();

            await execPromise(`gsc -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${compressFilePath}" ${outputFilePath}`)
            fs.unlinkSync(outputFilePath);
        }
    }
})()

