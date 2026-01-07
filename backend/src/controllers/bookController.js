import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import {
    getBookById,
    createBook,
    updateBookCover,
    deleteBook,
    getBookTags,
} from "../models/bookModel.js";
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
            const data = await uploadImage(bid, bookCover);
            if (!data.success) {
                throw new InputError(data.error.message);
            }
            newLink = data.data.url;
            await updateBookCover(bid, newLink);
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
        throw new DBError(err);
    }
};

// TODO: also get all info about the book's chapters
const bookInfo = async (req, res) => {
    const bid = req.params.bid.trim();

    const bookData = await getBookById(bid);
    if (!bookData) {
        throw new InputError("Book not found");
    }

    bookData.tags = await getBookTags(bid);

    res.json({
        success: true,
        data: {
            book: bookData,
        },
    });
};

// TODO: get all books (main dashboard) and their total likes + reads AND implement filters/pagination
const bookInfoAll = async (req, res) => {};

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

export { bookCreate, bookInfo, bookInfoAll, bookDelete };
