import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    institution:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    portfolioProp:
    {
        type: mongoose.Types.ObjectId,
        ref: "Portfolio",
        required: false
    }
});
export default mongoose.model("User", userSchema);