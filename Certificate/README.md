# Certificate

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.30. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

-------------

The list of client is get from a SQLite database, the script used for create the table is:

```sql
CREATE TABLE Certificates
(
    Serial          INTEGER NOT NULL
        CONSTRAINT Certificates_PK
            PRIMARY KEY AUTOINCREMENT,
    Directory       TEXT    NOT NULL,
    Name            TEXT    NOT NULL,
    Email           TEXT    NOT NULL,
    File            TEXT    NOT NULL,
    MessageId       TEXT,
    ResponseMessage TEXT
);
```