import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import {
    userOwnsBook,
    getBookById,
    getBookTags,
    getBookChapters,
    getAllBooks,
    createBook,
    updateBookCover,
    deleteBook,
    tagBook,
    unTagBook,
    updateBookText,
} from "../models/bookModel.js";
import { getUserById } from "../models/userModel.js";
import { uploadImage } from "../utils/image.js";

const bookCreate = async (req, res) => {
    const { title, blurb, bookCover } = req.body;
    const uid = req.user.uid;

    try {
        const bid = await createBook(title, blurb, uid);

        // Store cover AFTER creating book to avoid uploading to imgbb
        // when new book is invalid
        let newLink = "";
        if (bookCover) {
            newLink = storeBookCover(bid, bookCover);
        }

        const bookData = {
            bid: bid,
            image: newLink,
        };
        res.status(201).json({
            success: true,
            data: {
                book: bookData,
            },
        });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

/**
 * Uploads then stores the provided book cover
 * @param {uuid} bid - book's bid
 * @param {*} bookCover - book cover image
 * @returns the link to the new book cover
 */
const storeBookCover = async (bid, bookCover) => {
    const data = await uploadImage(bid, bookCover);
    if (!data.success) {
        throw new InputError(data.error.message);
    }
    const newLink = data.data.url;
    await updateBookCover(bid, newLink);

    return newLink;
};

const bookInfo = async (req, res) => {
    const bid = req.params.bid.trim();

    const bookData = await getBookById(bid);
    if (!bookData) {
        throw new InputError("Book not found");
    }

    const wrappedBookData = await wrapBookData(bookData);

    res.json({
        success: true,
        data: wrappedBookData,
    });
};

const bookInfoAll = async (req, res) => {
    const order = req.query.order;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const tag = req.query.tag;

    const allBooksData = [];
    const data = await getAllBooks(order, limit, offset, tag);
    for (const bookData of data) {
        const wrappedBookData = await wrapBookData(bookData);
        allBooksData.push(wrappedBookData);
    }

    res.json({
        success: true,
        data: {
            books: allBooksData,
        },
    });
};

/**
 * Given a book data object, adds fields containing user, chapter and tag information
 * @param {Object} bookData - object containing book information
 * @returns object described above
 */
const wrapBookData = async (bookData) => {
    const uid = bookData.written_by;
    const user = await getUserById(uid);
    if (!user) {
        throw new InputError("User not found");
    }

    const userData = {
        uid: user.uid,
        email: user.email,
        username: user.username,
        image: user.profile_image,
        joined_at: user.joined_at,
    };

    const bid = bookData.bid;
    bookData.chapters = await getBookChapters(bid);
    if (!bookData.tags) {
        bookData.tags = await getBookTags(bid);
    }

    return {
        user: userData,
        book: bookData,
    };
};

const bookUpdate = async (req, res) => {
    const bid = req.params.bid.trim();
    let { newTitle, newBlurb, newBookCover } = req.body;
    const uid = req.user.uid;

    if (newTitle) {
        newTitle = newTitle.trim();
    }

    if (newBlurb) {
        newBlurb = newBlurb.trim();
    }

    try {
        // Only update books the user owns
        const success = await userOwnsBook(bid, uid);
        if (!success) {
            throw new InputError("Book not found or user didn't write it");
        }
        await updateBookText(bid, newTitle, newBlurb);

        if (newBookCover) {
            await storeBookCover(bid, newBookCover);
        }

        res.json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const bookDelete = async (req, res) => {
    const bid = req.params.bid.trim();
    const uid = req.user.uid;

    try {
        const success = await deleteBook(bid, uid);
        if (!success) {
            throw new InputError("No such book was written by the user");
        }
        res.json({ success: true });
    } catch (err) {
        throw new DBError(err);
    }
};

const bookTag = async (req, res) => {
    const bid = req.params.bid.trim();
    const tagName = req.body.tagName.trim();
    const uid = req.user.uid;

    try {
        // Only tag books the user owns
        const success = await userOwnsBook(bid, uid);
        if (!success) {
            throw new InputError("Book not found or user didn't write it");
        }

        await tagBook(bid, tagName);
        res.status(201).json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const bookUntag = async (req, res) => {
    const bid = req.params.bid.trim();
    const tagName = req.body.tagName.trim();
    const uid = req.user.uid;

    try {
        // Only remove tags from books the user owns
        let success = await userOwnsBook(bid, uid);
        if (!success) {
            throw new InputError("Book not found or user didn't write it");
        }

        success = await unTagBook(bid, tagName);
        if (!success) {
            throw new InputError("Book does not have such a tag");
        }
        res.json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

export {
    bookCreate,
    bookInfo,
    bookInfoAll,
    bookUpdate,
    bookDelete,
    bookTag,
    bookUntag,
};
