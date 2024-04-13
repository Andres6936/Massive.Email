import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const Certificates = sqliteTable('Certificates', {
    Serial: integer('Serial').primaryKey({autoIncrement: true}),
    Directory: text('Directory').notNull(),
    Name: text('Name').notNull(),
    Email: text('Email').notNull(),
    File: text('File').notNull(),
    MessageId: text('MessageId'),
    ResponseMessage: text('ResponseMessage'),
    Month: text('Month'),
    Day: integer('Day'),
});