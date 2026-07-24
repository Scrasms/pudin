-- Trigger that increments/decrements the likes columnn in Chapter whenever ChapterLikes table changes
CREATE OR REPLACE FUNCTION sync_chapter_likes() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE Chapter 
        SET likes = likes + 1 
        WHERE bid = NEW.bid AND number = NEW.number;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE Chapter
        SET likes = likes - 1
        WHERE bid = OLD.bid AND number = OLD.number;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chapter_likes_update
AFTER INSERT OR DELETE ON ChapterLikes
FOR EACH ROW EXECUTE FUNCTION sync_chapter_likes();

-- Trigger that increments/decrements the likes columnn in Comment whenever CommentLikes table changes
CREATE OR REPLACE FUNCTION sync_comment_likes() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE Comment
        SET likes = likes + 1 
        WHERE cid = NEW.cid;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE Comment
        SET likes = likes - 1
        WHERE cid = OLD.cid;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_likes_update
AFTER INSERT OR DELETE ON CommentLikes
FOR EACH ROW EXECUTE FUNCTION sync_comment_likes();