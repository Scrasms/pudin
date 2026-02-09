import { userOwnsBook } from "../models/bookModel.js";

/**
 * Checks if a user should only be able to see published books
 * @param {Object} user - user object
 * @param {uuid} bid - book's bid
 * @returns true if they can only see published books and false otherwise
 */
const getPublishedOnly = async (user, bid) => {
    // If user doesn't own the book, restrict search to published books
    let publishedOnly = true;
    if (user) {
        publishedOnly = !(await userOwnsBook(bid, user.uid));
    }
    return publishedOnly;
};

export { getPublishedOnly };
