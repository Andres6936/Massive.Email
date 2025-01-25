import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const Certificates = sqliteTable('Certificates', {
    Serial: integer('Serial').primaryKey({autoIncrement: true}),
    Directory: text('Directory').notNull(),
    Name: text('Name').notNull(),
    Email: text('Email').notNull(),
    File: text('File').notNull(),
    Month: text('Month'),
    Day: integer('Day'),
});

export type CertificateModel = typeof Certificates.$inferSelect;

export const People = sqliteTable('People', {
    Serial: integer('Serial').primaryKey({autoIncrement: true}),
    Name: text('Name').notNull(),
    Email: text('Email').notNull(),
    Month: text('Month').notNull(),
    MessageId: text('MessageId'),
    ResponseMessage: text('ResponseMessage'),
})

export type PeopleModel = typeof People.$inferSelect;