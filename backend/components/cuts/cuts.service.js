import mongoose from "mongoose";
import Cut from "../../db-schemas/cut.schema.js";

export const findCuts = async () => {
    return await Cut.find().lean();
}

export const findCutById = async (cutId) => {
    return await Cut.findById(cutId).lean().orFail();
}