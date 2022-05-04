-- file definition

CREATE TABLE file (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	guid TEXT NOT NULL,
	name TEXT NOT NULL,
	"desc" TEXT,
	"size" INTEGER NOT NULL,
    total INTEGER NOT NULL,
	sha1 TEXT NOT NULL);

-- mail definition

CREATE TABLE mail (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	mid TEXT NOT NULL,
	seq INTEGER NOT NULL,
    guid TEXT NOT NULL,
	attach_filename TEXT NOT NULL,
	attach_sha1 TEXT NOT NULL,
	file_guid TEXT NOT NULL);

CREATE INDEX file_guid ON mail (file_guid);

-- queue definition

CREATE TABLE queue (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	mid TEXT NOT NULL,
    done INTEGER DEFAULT -1 NOT NULL);

