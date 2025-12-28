-- TODO: Cleanup all tables
-- create Sessions table linked to User table IF using sessions and NOT JWTs + refresh token
-- serial CAN'T BE USED IN FOREIGN KEYS BECAUSE IT'S NOT A REAL TYPE

DROP TYPE IF EXISTS SavedStatus;
CREATE TYPE SavedStatus AS ENUM ('unread', 'reading', 'read');

CREATE TABLE IF NOT EXISTS Users (
    uid uuid DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    password VARCHAR (64) NOT NULL, -- assuming SHA-256 hash, change length to length of the output of the encryption algo
    username text NOT NULL,
    profile_image text NOT NULL,
    joined_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (uid)
);

CREATE TABLE IF NOT EXISTS Book (
    bid uuid DEFAULT gen_random_uuid(),
    title text NOT NULL,
    blurb text,
    image text,
    written_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone,
    PRIMARY KEY (bid),
    FOREIGN KEY (written_by) REFERENCES Users(uid) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Tag (
    tag_name text,
    PRIMARY KEY (tag_name)
);

CREATE TABLE IF NOT EXISTS BookTags (
    bid uuid,
    tag_name text,
    PRIMARY KEY (bid, tag_name),
    FOREIGN KEY (bid) REFERENCES Book(bid) ON DELETE CASCADE,
    FOREIGN KEY (tag_name) REFERENCES Tag(tag_name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS BookSaves (
    uid uuid,
    bid uuid,
    saved_at timestamp with time zone DEFAULT now(),
    status SavedStatus DEFAULT 'unread'::SavedStatus,
    PRIMARY KEY (uid, bid),
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (bid) REFERENCES Book(bid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Chapter (
    bid uuid,
    number integer,
    title text NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone,
    likes bigint DEFAULT 0,
    reads bigint DEFAULT 0,
    PRIMARY KEY (bid, number),
    FOREIGN KEY (bid) REFERENCES Book(bid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ChapterLikes (
    uid uuid,
    bid uuid,
    number integer,
    PRIMARY KEY (uid, bid, number),
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (bid, number) REFERENCES Chapter(bid, number) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ChapterReads (
    uid uuid,
    bid uuid,
    number integer,
    read_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (uid, bid, number),
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (bid, number) REFERENCES Chapter(bid, number) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Comment (
    cid uuid DEFAULT gen_random_uuid(),
    message text,
    bid uuid NOT NULL,
    posted_at timestamp with time zone DEFAULT now(),
    posted_by uuid NOT NULL,
    number integer,
    replies_to uuid,
    likes bigint DEFAULT 0,
    PRIMARY KEY (cid),
    FOREIGN KEY (posted_by) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (bid, number) REFERENCES Chapter(bid, number) ON DELETE CASCADE,
    FOREIGN KEY (replies_to) REFERENCES Comment(cid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CommentLikes (
    cid uuid NOT NULL,
    uid uuid NOT NULL,
    PRIMARY KEY (cid, uid),
    FOREIGN KEY (cid) REFERENCES Comment(cid) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);
