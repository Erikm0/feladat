CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  email TEXT,
  comment TEXT,
  status BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE persons (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company_ref INTEGER NOT NULL REFERENCES companies(id),
  phone TEXT,
  email TEXT,
  comment TEXT,
  status BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  person_ref INTEGER NOT NULL REFERENCES persons(id),
  login TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  status BOOLEAN NOT NULL DEFAULT TRUE
);

BEGIN;

INSERT INTO companies (name, location, phone, email, comment, status)
VALUES  ('Példa Kft.','Budapest','+36 30 123 4567','info@peldakft.hu','Első cég', TRUE),
        ('Második Kft.','Budapest','+36 50 142 7576','info@peldakettokft.hu','Második cég', TRUE);

INSERT INTO persons (name, company_ref, phone, email, comment, status)
VALUES  ('Teszt Admin',1,'+36 30 999 9999','admin@peldakft.hu','Rendszergazda', TRUE),
        ('Teszt Gyakornok',2,'+36 50 461 3162','gyakorok@peldakettokft.hu','Gyakornok', TRUE);

INSERT INTO users (person_ref, login, password, admin, status)
VALUES  (1,'admin','$2b$10$hniG4vk5HJuH96kLKaDDQubcG3TVwrZRKALSKQkGOk20wAmN.JLqm',TRUE, TRUE), /*jelszó: admin*/
        (2,'gyakorok','$2b$10$BQWSxlKZXRY2lpGftzi3GOYLLjjZ63wdTEQvCiW0zSd3DsH/DSI/i',FALSE, TRUE); /*jelszó: nemadmin*/

COMMIT;
