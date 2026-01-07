-- Stores info about the book as well as its total likes and reads
CREATE OR REPLACE VIEW BookInfo AS
SELECT
    b.*,
    COALESCE(SUM(c.likes), 0)::integer AS total_likes,
    COALESCE(SUM(c.reads), 0)::integer AS total_reads,
    COUNT(c.*)::integer AS total_chapters
FROM Book b
LEFT JOIN Chapter c ON c.bid = b.bid
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