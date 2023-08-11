import mongoose from "mongoose";

const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    file: {
        fileId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        filename: String,
        contentType: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

export default mongoose.model("Portfolio", portfolioSchema);