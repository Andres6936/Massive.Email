import glob
import mimetypes
import os.path
from email.message import EmailMessage

from Entity.Sheet import Sheet


def GetMessageTemplate(client: Sheet):
    return f"""
    <html lang='es'>
        <body>
            <section>                
                <p>
                    {client.Name}<br />
                    NIT.: {client.Identification}<br />
                    {client.ContactPerson}<br />
                    {client.Address}<br />
                    {client.NumberContact}<br />
                    {client.Email}<br />
                    La ciudad<br />
                </p>
            </section>
        </body>
    </html>
"""


# Used for store the file in cache and avoid unnecessary I/O
cache = {}


def AddAttachmentGeneral(mimeMessage: EmailMessage):
    for file in glob.glob('Attachment/General/*'):
        # guessing the MIME type
        type_subtype, _ = mimetypes.guess_type(file)
        maintype, subtype = type_subtype.split('/')

        if cache.get(file) is None:
            with open(file, 'rb') as fp:
                attachment_data = fp.read()
                mimeMessage.add_attachment(
                    attachment_data, maintype, subtype,
                    filename=os.path.basename(fp.name))
                # Added the buffer to cache
                cache[file] = attachment_data
        else:
            # Using the cache of general file
            mimeMessage.add_attachment(
                cache.get(file), maintype, subtype,
                filename=os.path.basename(file))
