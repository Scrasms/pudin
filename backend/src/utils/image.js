import dotenv from "dotenv";
dotenv.config();

/**
 * Uploads a user's image to imgbb
 * @param {uuid} name - the name of the image
 * @param {*} newImage - the new image to be uploaded
 * @returns - response object
 */
const uploadImage = async (name, newImage) => {
    // Upload file to imgbb (32mb limit) with expiry date of 1 month
    const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: new URLSearchParams({
            name: name,
            key: process.env.IMGBB_KEY,
            image: newImage,
            expiration: 2628000
        }),
    });
    const data = await response.json();
    return data;
};

export { uploadImage };
