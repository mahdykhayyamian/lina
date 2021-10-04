delete from paragraph.CHAT_MESSAGE;
DROP Table paragraph.CHAT_MESSAGE;

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

CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;

CREATE TABLE IF NOT EXISTS paragraph.ROOM(
    id UUID DEFAULT public.gen_random_uuid(),
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
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
    room_id UUID REFERENCES paragraph.ROOM(id),
    content_type_id INTEGER REFERENCES paragraph.CONTENT_TYPE(id),
    commands TEXT,
    next_board_id INTEGER,
    previous_board_id INTEGER,
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
    room_id UUID REFERENCES paragraph.ROOM(id),
    username TEXT,
    chat_color TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paragraph.CHAT_MESSAGE (
    id SERIAL PRIMARY KEY NOT NULL,
    room_id UUID REFERENCES paragraph.ROOM(id),
    sender_email TEXT,
    sender_given_name TEXT,
    text_content TEXT,
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
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('venn-diagram', 'Venn Diagram', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('graph', 'Graph', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('tree-chart', 'Tree Chart', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('funnel', 'Funnel Chart', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('erd', 'Entity Relationship Diagram', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('flowchart', 'Flowchart', current_timestamp);
INSERT INTO paragraph.CONTENT_TYPE (type, name, created) VALUES ('piechart', 'Pie Chart', current_timestamp);

