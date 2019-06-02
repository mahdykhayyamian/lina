CREATE TABLE IF NOT EXISTS ROOM(
    id SERIAL PRIMARY KEY NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS CONTENT_TYPE (
    id SERIAL PRIMARY KEY NOT NULL,
    type TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS LINA_USER (
    id SERIAL PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BOARD (
    id SERIAL PRIMARY KEY NOT NULL,
    room_id INTEGER REFERENCES ROOM(id),
    content_type_id INTEGER REFERENCES CONTENT_TYPE(id),
    commands TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS SAMPLE_COMMAND (
    id SERIAL PRIMARY KEY NOT NULL,
    content_type_id INTEGER REFERENCES CONTENT_TYPE(id),
    commands TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ROOM_USERS (
    id SERIAL PRIMARY KEY NOT NULL,
    lina_user_id INTEGER REFERENCES LINA_USER(id),
    room_id INTEGER REFERENCES ROOM(id),
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);