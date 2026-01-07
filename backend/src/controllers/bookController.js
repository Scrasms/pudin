import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import {
    getBookById,
    createBook,
    updateBookCover,
    deleteBook,
    getBookTags,
    getBookChapters,
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

const bookInfo = async (req, res) => {
    const bid = req.params.bid.trim();

    const bookData = await getBookById(bid);
    if (!bookData) {
        throw new InputError("Book not found");
    }

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
    }

    bookData.chapter = await getBookChapters(bid);
    bookData.tag = await getBookTags(bid);

    res.json({
        success: true,
        data: {
            user: userData,
            book: bookData,
        },
    });
};

// TODO: get all books (main dashboard), their total likes + reads and no. of chapters AND implement filters/pagination
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
