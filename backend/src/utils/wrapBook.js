import InputError from "../errors/InputError.js";
import { getUserById } from "../models/userModel.js";
import { getBookChapters, getBookTags } from "../models/bookModel.js";

/**
 * Given a book data object, adds fields containing user, chapter and tag information
 * @param {Object} [user] - optional object containing ALL user information (will be filtered to remove sensitive info)
 * @param {Object} bookData - object containing book information
 * @param {boolean} publishedOnly - restrict search to published chapters only or not
 * @returns object described above
 */
const wrapBookData = async (user, bookData, publishedOnly) => {
    // Get user if not provided
    if (!user) {
        const uid = bookData.written_by;
        user = await getUserById(uid);
        if (!user) {
            throw new InputError("User not found");
        }
    }

    const userData = {
        uid: user.uid,
        email: user.email,
        username: user.username,
        image: user.profile_image,
        joined_at: user.joined_at,
    };

    const bid = bookData.bid;
    bookData.chapters = await getBookChapters(bid, publishedOnly);
    // Tags might already exist (getAllBooks creates it if a tag filter is applied)
    if (!bookData.tags) {
        bookData.tags = await getBookTags(bid);
    }

    return {
        user: userData,
        book: bookData,
    };
};

export { wrapBookData };
