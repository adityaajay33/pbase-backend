import mongoose from "mongoose";

const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    softwareUsed:{
        type: String,
        required: false,
    },
    description:{
        type: String,
        required: true,
    },    
    careerOutcomes:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required: true,
    }
});

export default mongoose.model("Portfolio", portfolioSchema);