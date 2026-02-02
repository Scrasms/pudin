import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import {
    createUserBookSave,
    deleteUserBookSave,
    getAllUserBookSaves,
    getUserBookSave,
    updateUserBookSave,
} from "../models/saveModel.js";

const userBookSave = async (req, res) => {
    const bid = req.params.bid.trim();
    const uid = req.user.uid;

    try {
        await createUserBookSave(uid, bid);

        res.status(201).json({ success: true });
    } catch (err) {
        throw new DBError(err);
    }
};

const userBookSaveInfo = async (req, res) => {
    const bid = req.params.bid.trim();
    const uid = req.user.uid;

    try {
        const saveData = await getUserBookSave(uid, bid);
        if (saveData.length === 0) {
            throw new InputError("User did not save such a book");
        }

        res.json({
            success: true,
            data: {
                save: saveData,
            },
        });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const userBookSaveInfoAll = async (req, res) => {
    const uid = req.user.uid;

    const allSavesData = await getAllUserBookSaves(uid);

    res.json({
        success: true,
        data: {
            saves: allSavesData,
        },
    });
};

const userBookSaveUpdate = async (req, res) => {
    const { newStatus } = req.body;
    const bid = req.params.bid.trim();
    const uid = req.user.uid;

    try {
        const success = await updateUserBookSave(uid, bid, newStatus);
        if (!success) {
            throw new InputError(
                "New status is invalid or user did not save such a book",
            );
        }
        res.json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const userBookSaveDelete = async (req, res) => {
    const bid = req.params.bid.trim();
    const uid = req.user.uid;

    try {
        const success = await deleteUserBookSave(uid, bid);
        if (!success) {
            throw new InputError("User did not save such a book");
        }

        res.json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

export {
    userBookSave,
    userBookSaveInfo,
    userBookSaveInfoAll,
    userBookSaveUpdate,
    userBookSaveDelete,
};
