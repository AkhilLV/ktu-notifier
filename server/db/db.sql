CREATE TABLE IF NOT EXISTS emails (
    id UUID NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS filters (
    id UUID NOT NULL PRIMARY KEY,
    email_id UUID NOT NULL,
    filter VARCHAR(255) NOT NULL,
    FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notification_counter (
    counter_id INT NOT NULL PRIMARY KEY,
    counter INT NOT NULL
);

-- 3014 is an arbitrary number. Run db.syncNotificationCounter to sync with ktu.com 
INSERT INTO notification_counter VALUES (1, 3014); 
