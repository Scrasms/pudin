-- TODO: Cleanup all tables further
-- add indexes to tables for faster queries

-- Types
DROP TYPE IF EXISTS SavedStatus CASCADE;
CREATE TYPE SavedStatus AS ENUM ('unread', 'reading', 'read');

-- Tables
DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users (
    uid uuid DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    username text NOT NULL UNIQUE,
    profile_image text,
    joined_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (uid)
);

DROP TABLE IF EXISTS UserResetCodes CASCADE;
CREATE TABLE UserResetCodes(
    uid uuid,
    code text,
    PRIMARY KEY (uid, code),
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Book CASCADE;
CREATE TABLE Book (
    bid uuid DEFAULT gen_random_uuid(),
    title text NOT NULL,
    blurb text,
    image text,
    written_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone,
    PRIMARY KEY (bid),
    FOREIGN KEY (written_by) REFERENCES Users(uid) ON DELETE CASCADE,
    UNIQUE (title, written_by)
);

DROP TABLE IF EXISTS Tag CASCADE;
CREATE TABLE Tag (
    tag_name text,
    PRIMARY KEY (tag_name)
);

DROP TABLE IF EXISTS BookTags CASCADE;
CREATE TABLE BookTags (
    bid uuid,
    tag_name text,
    PRIMARY KEY (bid, tag_name),
    FOREIGN KEY (bid) REFERENCES Book(bid) ON DELETE CASCADE,
    FOREIGN KEY (tag_name) REFERENCES Tag(tag_name) ON DELETE CASCADE
);

DROP TABLE IF EXISTS BookSaves CASCADE;
CREATE TABLE BookSaves (
    uid uuid,
    bid uuid,
    saved_at timestamp with time zone DEFAULT now(),
    status SavedStatus DEFAULT 'unread'::SavedStatus,
    PRIMARY KEY (uid, bid),
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (bid) REFERENCES Book(bid) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Chapter CASCADE;
CREATE TABLE Chapter (
    bid uuid,
    number integer DEFAULT 1,
    title text NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone,
    likes integer DEFAULT 0,
    reads integer DEFAULT 0,
    PRIMARY KEY (bid, number),
    FOREIGN KEY (bid) REFERENCES Book(bid) ON DELETE CASCADE
);

DROP TABLE IF EXISTS ChapterLikes CASCADE;
CREATE TABLE ChapterLikes (
    uid uuid,
    bid uuid,
    number integer,
    PRIMARY KEY (uid, bid, number),
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (bid, number) REFERENCES Chapter(bid, number) ON DELETE CASCADE
);

DROP TABLE IF EXISTS ChapterReads CASCADE;
CREATE TABLE ChapterReads (
    uid uuid,
    bid uuid,
    number integer,
    read_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (uid, bid, number),
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (bid, number) REFERENCES Chapter(bid, number) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Comment CASCADE;
CREATE TABLE Comment (
    cid uuid DEFAULT gen_random_uuid(),
    message text NOT NULL,
    bid uuid NOT NULL,
    number integer,
    posted_at timestamp with time zone DEFAULT now(),
    posted_by uuid NOT NULL,
    replies_to uuid,
    likes integer DEFAULT 0,
    PRIMARY KEY (cid),
    FOREIGN KEY (posted_by) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (bid, number) REFERENCES Chapter(bid, number) ON DELETE CASCADE,
    FOREIGN KEY (replies_to) REFERENCES Comment(cid) ON DELETE CASCADE
);

DROP TABLE IF EXISTS CommentLikes CASCADE;
CREATE TABLE CommentLikes (
    cid uuid NOT NULL,
    uid uuid NOT NULL,
    PRIMARY KEY (cid, uid),
    FOREIGN KEY (cid) REFERENCES Comment(cid) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);

-- Indexes


