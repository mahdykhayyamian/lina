CREATE TABLE IF NOT EXISTS SESSION(
    id INT PRIMARY KEY NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS CONTENT_TYPE (
    id INT PRIMARY KEY NOT NULL,
    type TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS LINA_USER (
    id INT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BOARD (
    id INT PRIMARY KEY NOT NULL,
    session_id INTEGER REFERENCES SESSION(id),
    content_type_id INTEGER REFERENCES CONTENT_TYPE(id),
    commands TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS SAMPLE_COMMAND (
    id INT PRIMARY KEY NOT NULL,
    content_type_id INTEGER REFERENCES CONTENT_TYPE(id),
    commands TEXT,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS USER_SESSION (
    id INT PRIMARY KEY NOT NULL,
    lina_user_id INTEGER REFERENCES LINA_USER(id),
    session_id INTEGER REFERENCES SESSION(id),
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);