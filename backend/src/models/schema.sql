-- TODO: Cleanup all tables, create User table, create Sessions table linked to User table IF using sessions and NOT JWTs + refresh tokens

CREATE TYPE SavedStatus AS ENUM ('unread', 'reading', 'read');

CREATE TABLE User (
    uid uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    email text NOT NULL,
    password VARCHAR (64) NOT NULL, -- assuming SHA-256 hash, change length to length of the output of the encryption algo
    name text NOT NULL,
    joined_at timestamp with time zone DEFAULT now()
);

CREATE TABLE UserProfiles (
    uid uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    image text NOT NULL,
    CONSTRAINT UserProfiles_pkey PRIMARY KEY (uid, image),
    CONSTRAINT UserProfiles_uid_fkey FOREIGN KEY (uid) REFERENCES Users(id)
);

CREATE TABLE Book (
    bid uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    blurb text,
    image text,
    written_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone,
    CONSTRAINT Book_pkey PRIMARY KEY (bid),
    CONSTRAINT Book_written_by_fkey FOREIGN KEY (written_by) REFERENCES Users(id)
);

CREATE TABLE BookSaves (
    uid uuid NOT NULL,
    bid uuid NOT NULL,
    saved_at timestamp with time zone DEFAULT now(),
    status USER-DEFINED DEFAULT 'unread'::"SavedStatus",
    CONSTRAINT BookSaves_pkey PRIMARY KEY (uid, bid),
    CONSTRAINT BookSaves_uid_fkey FOREIGN KEY (uid) REFERENCES Users(id),
    CONSTRAINT BookSaves_bid_fkey FOREIGN KEY (bid) REFERENCES Book(bid)
);

CREATE TABLE Tag (
    tag_name text NOT NULL,
    CONSTRAINT Tag_pkey PRIMARY KEY (tag_name)
);

CREATE TABLE BookTags (
    bid uuid NOT NULL,
    tag_name text NOT NULL DEFAULT ''::text,
    CONSTRAINT BookTags_pkey PRIMARY KEY (bid, tag_name),
    CONSTRAINT BookTags_bid_fkey FOREIGN KEY (bid) REFERENCES Book(bid),
    CONSTRAINT BookTags_tag_name_fkey FOREIGN KEY (tag_name) REFERENCES Tag(tag_name)
);

CREATE TABLE Chapter (
    bid uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    number integer NOT NULL DEFAULT nextval('"Chapter_number_seq"'::regclass),
    title text NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now(),
    published_at timestamp with time zone,
    likes bigint DEFAULT '0'::bigint,
    reads bigint DEFAULT '0'::bigint,
    CONSTRAINT Chapter_pkey PRIMARY KEY (bid, number),
    CONSTRAINT Chapter_bid_fkey FOREIGN KEY (bid) REFERENCES Book(bid)
);

CREATE TABLE ChapterLikes (
    uid uuid NOT NULL,
    bid uuid NOT NULL,
    number integer NOT NULL DEFAULT nextval('"ChapterLikes_number_seq"'::regclass),
    CONSTRAINT ChapterLikes_pkey PRIMARY KEY (uid, bid, number),
    CONSTRAINT ChapterLikes_uid_fkey FOREIGN KEY (uid) REFERENCES Users(id),
    CONSTRAINT fk_chapter_bid_number FOREIGN KEY (bid) REFERENCES Chapter(bid),
    CONSTRAINT fk_chapter_bid_number FOREIGN KEY (bid) REFERENCES Chapter(number),
    CONSTRAINT fk_chapter_bid_number FOREIGN KEY (number) REFERENCES Chapter(bid),
    CONSTRAINT fk_chapter_bid_number FOREIGN KEY (number) REFERENCES Chapter(number)
);

CREATE TABLE ChapterReads (
    uid uuid NOT NULL,
    bid uuid NOT NULL,
    number integer NOT NULL DEFAULT nextval('"ChapterReads_number_seq"'::regclass),
    read_at timestamp with time zone DEFAULT now(),
    CONSTRAINT ChapterReads_pkey PRIMARY KEY (uid, bid, number),
    CONSTRAINT ChapterReads_uid_fkey FOREIGN KEY (uid) REFERENCES Users(id),
    CONSTRAINT ChapterReads_bid_number_fkey FOREIGN KEY (bid) REFERENCES Chapter(bid),
    CONSTRAINT ChapterReads_bid_number_fkey FOREIGN KEY (bid) REFERENCES Chapter(number),
    CONSTRAINT ChapterReads_bid_number_fkey FOREIGN KEY (number) REFERENCES Chapter(bid),
    CONSTRAINT ChapterReads_bid_number_fkey FOREIGN KEY (number) REFERENCES Chapter(number)
);

CREATE TABLE Comment (
    cid uuid NOT NULL DEFAULT gen_random_uuid(),
    message text,
    bid uuid NOT NULL DEFAULT gen_random_uuid(),
    posted_at timestamp with time zone DEFAULT now(),
    posted_by uuid NOT NULL,
    number integer NOT NULL DEFAULT nextval('"Comment_number_seq"'::regclass),
    replies_to uuid,
    likes bigint DEFAULT '0'::bigint,
    CONSTRAINT Comment_pkey PRIMARY KEY (cid),
    CONSTRAINT Comment_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES Users(id),
    CONSTRAINT Comment_bid_number_fkey FOREIGN KEY (bid) REFERENCES Chapter(bid),
    CONSTRAINT Comment_bid_number_fkey FOREIGN KEY (bid) REFERENCES Chapter(number),
    CONSTRAINT Comment_bid_number_fkey FOREIGN KEY (number) REFERENCES Chapter(bid),
    CONSTRAINT Comment_bid_number_fkey FOREIGN KEY (number) REFERENCES Chapter(number),
    CONSTRAINT Comment_replies_to_fkey FOREIGN KEY (replies_to) REFERENCES Comment(cid)
);

CREATE TABLE CommentLikes (
    cid uuid NOT NULL,
    uid uuid NOT NULL,
    CONSTRAINT CommentLikes_pkey PRIMARY KEY (cid, uid),
    CONSTRAINT CommentLikes_cid_fkey FOREIGN KEY (cid) REFERENCES Comment(cid),
    CONSTRAINT CommentLikes_uid_fkey FOREIGN KEY (uid) REFERENCES Users(id)
);
