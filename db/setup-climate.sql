/* --------------------------------------------climate------------------------------------------------ */
DELETE from climate.DAILY_MEASURES;
DROP Table climate.DAILY_MEASURES;

delete from climate.STATION;
DROP Table climate.STATION;

CREATE SCHEMA IF NOT EXISTS climate;

CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;

CREATE TABLE IF NOT EXISTS climate.STATION (
	id UUID DEFAULT public.gen_random_uuid() PRIMARY KEY,    
	code TEXT UNIQUE NOT NULL,    
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation DOUBLE PRECISION NOT NULL,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS climate.DAILY_MEASURES (
	id UUID DEFAULT public.gen_random_uuid() PRIMARY KEY,    
    station_id UUID REFERENCES climate.STATION(id),
    date DATE NOT NULL,
    avg_temp  DOUBLE PRECISION,
    min_temp DOUBLE PRECISION,
    max_temp DOUBLE PRECISION,
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

GRANT USAGE ON SCHEMA climate TO lina_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA climate TO lina_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA climate TO lina_app;
