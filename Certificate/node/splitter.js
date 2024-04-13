#!/usr/bin/env node

import muhammara from 'muhammara'
import fs from 'node:fs'

const reader = muhammara.createReader("../obj/N22.pdf")
const pages = reader.getPagesCount();

fs.mkdirSync("../obj/N22", {
    recursive: true
})

for (let i = 1; i <= pages; i++) {
    const writer = muhammara.createWriter("../obj/N22/Output"  +  i + ".pdf")
    writer.createPDFCopyingContext(reader).appendPDFPageFromPDF(i - 1);
    writer.end();
}
