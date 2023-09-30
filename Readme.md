### Script Description

Script used for send massive email to several list of clients with several
emails registers, the message of email is parametrized in the file `Message.py`
the information of each email is unique each client, all the email send need
attachment files, and it is common in the email, for this objective the
files stored in the directory `Attachment/General/*` will be attachment to
each email send.

Currently, the script not send the email, only create the draft for peer 
review manual for an operator and send for these.

### Using

The script use the Google API Gmail for send the email (or create the draft)
for that this program work needed download the `Credential.json` from Console
Google Cloud, with this file, the program in the first execution create the
`Token.json` when the auth is successful, it avoids trigger the auth with each
execution of program.

The list of client is get from a SQLite database, the script used for create
the table is:

```sql
CREATE TABLE Sheet
(
    Name           TEXT PRIMARY KEY,
    Identification TEXT,
    TypeAndName    TEXT,
    RepresentLegal TEXT,
    ContactPerson  TEXT,
    NumberContact  TEXT,
    Address        TEXT,
    Neighborhood   TEXT,
    Location       TEXT,
    Email          TEXT,
    Environment    TEXT
);
```