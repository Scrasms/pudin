import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { createBook, updateBookCover } from "../models/bookModel.js";
import { uploadImage } from "../utils/image.js";

const bookCreate = async (req, res) => {
    const { title, blurb, bookCover } = req.body;
    const uid = req.user.uid;

    try {
        const bid = await createBook(title, blurb, uid);

        // Store cover AFTER creating book to avoid uploading to imgbb
        // when new book is invalid
        const data = await uploadImage(bid, bookCover);
        if (!data.success) {
            throw new InputError(data.error.message);
        }
        const newLink = data.data.url;
        await updateBookCover(bid, newLink);

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

export { bookCreate };
