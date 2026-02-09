import { userOwnsBook } from "../models/bookModel.js";

/**
 * Checks if a user should only be able to see published books/chapters
 * @param {Object} user - user object
 * @param {uuid} bid - book's bid
 * @returns true if they can only see published books/chapters and false otherwise
 */
const checkPublishedOnly = async (user, bid) => {
    // If user doesn't own the book, restrict search to published books/chapters
    let publishedOnly = true;
    if (user) {
        publishedOnly = !(await userOwnsBook(bid, user.uid));
    }
    return publishedOnly;
};

export { checkPublishedOnly };
