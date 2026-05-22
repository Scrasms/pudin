import DBError from "../errors/DBError.js";
import { createTag } from "../models/tagModel.js";

const tagCreate = async (req, res) => {
    const tagName = req.body.tagName.trim();

    try {
        await createTag(tagName);

        res.status(201).json({ message: "Tag successfully created" });
    } catch (err) {
        throw new DBError(err);
    }
};

export { tagCreate };
