from peewee import *

db = SqliteDatabase('Data/Personal.sqlite')


class Sheet(Model):
    Name = TextField(primary_key=True)
    Identification = TextField()
    TypeAndName = TextField()
    RepresentLegal = TextField()
    ContactPerson = TextField()
    NumberContact = TextField()
    Address = TextField()
    Neighborhood = TextField()
    Location = TextField()
    Email = TextField()
    Environment = TextField()

    class Meta:
        database = db
