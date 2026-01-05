import dotenv from "dotenv";
dotenv.config();

/**
 * Uploads a user's profile image to imagebb
 * @param {uuid} uid - the user's uid
 * @param {*} newProfile - the new profile to upload
 * @returns - response object
 */
const uploadProfile = async (uid, newProfile) => {
    // Upload file to imgbb (32mb limit) with expiry date of 1 month
    const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: new URLSearchParams({
            name: uid,
            key: process.env.IMGBB_KEY,
            image: newProfile,
            expiration: 2628000
        }),
    });
    const data = await response.json();
    return data;
};

export { uploadProfile };
