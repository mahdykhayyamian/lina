DELETE from paragraph.ROOM_USERS;
DROP Table paragraph.ROOM_USERS;

delete from paragraph.BOARD;
DROP Table paragraph.BOARD;

DELETE from paragraph.SAMPLE_COMMAND;
DROP Table paragraph.SAMPLE_COMMAND;

DELETE from paragraph.CONTENT_TYPE;
DROP Table paragraph.CONTENT_TYPE;

delete from paragraph.LINA_USER;
DROP Table paragraph.LINA_USER;

delete from paragraph.ROOM;
DROP Table paragraph.ROOM;

CREATE SCHEMA IF NOT EXISTS paragraph;

CREATE TABLE IF NOT EXISTS paragraph.ROOM(
    id SERIAL PRIMARY KEY NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paragraph.CONTENT_TYPE (
    id SERIAL PRIMARY KEY NOT NULL,
    type TEXT UNIQUE,
    name TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paragraph.LINA_USER (
    id SERIAL PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paragraph.BOARD (
    id SERIAL PRIMARY KEY NOT NULL,
    room_id INTEGER REFERENCES paragraph.ROOM(id),
    content_type_id INTEGER REFERENCES paragraph.CONTENT_TYPE(id),
    commands TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paragraph.SAMPLE_COMMAND (
    id SERIAL PRIMARY KEY NOT NULL,
    content_type_id INTEGER REFERENCES paragraph.CONTENT_TYPE(id),
    commands TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paragraph.ROOM_USERS (
    id SERIAL PRIMARY KEY NOT NULL,
    lina_user_id INTEGER REFERENCES paragraph.LINA_USER(id),
    room_id INTEGER REFERENCES paragraph.ROOM(id),
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

GRANT USAGE ON SCHEMA paragraph TO lina_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA paragraph TO lina_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA paragraph TO lina_app;

INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('bar-chart', 'Bar Chart', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('markdown',  'Mark Down', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('sequence-diagram', 'Sequence Diagram', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('math', 'Math', current_timestamp);