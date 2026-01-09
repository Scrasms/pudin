-- Stores info about all books as well as their total likes and reads
CREATE OR REPLACE VIEW BookInfoAll AS
SELECT
    b.*,
    COALESCE(SUM(c.likes), 0)::integer AS total_likes,
    COALESCE(SUM(c.reads), 0)::integer AS total_reads,
    COUNT(c.*)::integer AS total_chapters
FROM Book b
LEFT JOIN Chapter c ON c.bid = b.bid
GROUP BY b.bid
;

-- Stores info about all published books as well as their published likes and reads
-- Note that created_at is not visible in this case
CREATE OR REPLACE VIEW BookInfoPublished AS
SELECT
    b.bid,
    b.title,
    b.blurb,
    b.image,
    b.written_by,
    b.published_at,
    COALESCE(SUM(c.likes), 0)::integer AS published_likes,
    COALESCE(SUM(c.reads), 0)::integer AS published_reads,
    COUNT(c.*)::integer AS published_chapters
FROM Book b
LEFT JOIN Chapter c ON c.bid = b.bid AND c.published_at IS NOT NULL
WHERE b.published_at IS NOT NULL
GROUP BY b.bid
;

-- Stores the tags of each book as an array
CREATE OR REPLACE VIEW BookTagsList AS
SELECT
    b.bid AS bid,
    ARRAY_AGG(t.tag_name) AS tags
FROM Book b
LEFT JOIN BookTags bt ON bt.bid = b.bid
LEFT JOIN Tag t ON t.tag_name = bt.tag_name
GROUP BY b.bid
;