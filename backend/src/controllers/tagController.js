import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { createTag } from "../models/tagModel.js";

const tagCreate = async (req, res) => {
    const tagName = req.body.tagName.trim();

    try {
        await createTag(tagName);

        res.status(201).json({ success: true });
    } catch (err) {
        throw new DBError(err);
    }
};



export { tagCreate };
