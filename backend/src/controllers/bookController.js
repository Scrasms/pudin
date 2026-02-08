import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import {
    userOwnsBook,
    getBookById,
    getAllPublishedBooks,
    createBook,
    updateBookText,
    updateBookCover,
    updateBookPublish,
    deleteBook,
} from "../models/bookModel.js";
import { deleteAllUserBookSave } from "../models/saveModel.js";
import { tagBook, untagBook } from "../models/tagModel.js";
import { uploadImage } from "../utils/image.js";
import { wrapBookData } from "../utils/wrapBook.js";

const bookCreate = async (req, res) => {
    const { title, blurb, bookCover } = req.body;
    const uid = req.user.uid;

    try {
        const bid = await createBook(title, blurb, uid);

        // Store cover AFTER creating book to avoid uploading to imgbb
        // when new book is invalid
        let link = "";
        if (bookCover) {
            link = await storeBookCover(bid, bookCover);
        }

        const bookData = {
            bid: bid,
            image: link,
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
    const link = data.data.url;
    await updateBookCover(bid, link);

    return link;
};

const bookInfo = async (req, res) => {
    const bid = req.params.bid.trim();

    // If user doesn't own the book, restrict search to published books
    let publishedOnly = true;
    if (req.user) {
        publishedOnly = !(await userOwnsBook(bid, req.user.uid));
    }
    const bookData = await getBookById(bid, publishedOnly);
    if (!bookData) {
        throw new InputError("Book not found");
    }

    const wrappedBookData = await wrapBookData(
        req.user,
        bookData,
        publishedOnly,
    );

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
    const searchQuery = req.query.searchQuery;

    const allBooksData = [];

    // Always restrict search to published books when getting all books for dashboard
    const data = await getAllPublishedBooks(
        order,
        limit,
        offset,
        tag,
        searchQuery,
    );
    for (const bookData of data) {
        const wrappedBookData = await wrapBookData(null, bookData, true);
        allBooksData.push(wrappedBookData);
    }

    res.json({
        success: true,
        data: {
            books: allBooksData,
        },
    });
};

const bookUpdate = async (req, res) => {
    const bid = req.params.bid.trim();
    let { title, blurb, bookCover, publish } = req.body;
    const uid = req.user.uid;

    if (title) {
        title = title.trim();
    }

    if (blurb) {
        blurb = blurb.trim();
    }

    try {
        // Only update books the user owns
        let success = await userOwnsBook(bid, uid);
        if (!success) {
            throw new InputError("Book not found or user didn't write it");
        }
        await updateBookText(bid, title, blurb);

        if (bookCover) {
            await storeBookCover(bid, bookCover);
        }

        success = await updateBookPublish(bid, publish);
        if (!success && publish) {
            throw new InputError("Book is already published");
        } else if (!success) {
            throw new InputError("Book is already unpublished");
        }

        // Unsave the unpublished book for all users that had it saved
        if (success && !publish) {
            await deleteAllUserBookSave(bid);
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
        if (err instanceof InputError) throw err;
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

        success = await untagBook(bid, tagName);
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
