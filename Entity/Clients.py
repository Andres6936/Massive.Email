from peewee import *

db = SqliteDatabase('Data/Personal.sqlite')


class Clients(Model):
    Serial = TextField(primary_key=True)
    Email = TextField()
    Path = TextField()

    class Meta:
        database = db
