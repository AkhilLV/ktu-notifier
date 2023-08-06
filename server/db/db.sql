CREATE DATABASE IF NOT EXISTS ktu_notifier;

\c ktu_notifier;

CREATE TABLE emails (
    id UUID NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE filters (
    id UUID NOT NULL PRIMARY KEY,
    email_id UUID NOT NULL,
    filter VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
);

CREATE TABLE notification_counter (
    counter_id INT NOT NULL PRIMARY KEY,
    counter INT NOT NULL
);

INSERT INTO notification_counter VALUES (1, 3014);
