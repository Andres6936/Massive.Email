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
create table Certificates
(
    Serial    integer not null
        constraint Certificates_PK
            primary key autoincrement,
    Directory TEXT    not null,
    Name      TEXT    not null,
    Email     TEXT    not null,
    File      TEXT    not null,
    Month     TEXT,
    Day       integer
);


CREATE TABLE People
(
    Serial          INTEGER NOT NULL
        CONSTRAINT People_PK
            PRIMARY KEY AUTOINCREMENT,
    Name            TEXT    NOT NULL,
    Email           TEXT    NOT NULL,
    Month           TEXT    NOT NULL,
    MessageId       TEXT,
    ResponseMessage TEXT
);
```

Used for populate the table of People:

```sql
-- Clear the values in the register of certificates
UPDATE Certificates SET Name = TRIM(Name);
UPDATE Certificates SET Email = replace(TRIM(Email), ' ', '');

-- Prepare the table for the send of emails
INSERT INTO People (Name, Email, Month)
SELECT DISTINCT Certificates.Name, Certificates.Email, Certificates.Month
FROM Certificates;

-- Verify if exist register duplicates, these query must be return 0 results,
-- if results is returned, only a register should be choice
SELECT Name, COUNT(*) FROM People GROUP BY Name HAVING COUNT(*) > 1;
```