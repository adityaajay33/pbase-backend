import Portfolio from "../model/portfolio";
import User from "../model/User";
import mongoose from "mongoose";
import { GridFSBucket, MongoClient } from "mongodb";
import multer from "multer";

export const getAllPortfolios = async(req, res, next) =>{
    let portfolios;
    try{
        portfolios = await Portfolio.find();
    }    catch(err){
        return console.log(err);
    }
    if(!portfolios){
        res.status(404).json({message: "No blogs were found."});
    }
    return res.status(200).json({portfolios});
}

export const postPortfolio = async (req, res, next) => {
    const {user} = req.body.user;
    console.log(user);
    const { originalname, mimetype, buffer } = req.file; // Added to handle uploaded image
    console.log(originalname, mimetype, buffer);

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching user data" });
    }

    if (!existingUser) {
        return res.status(404).json({ message: "Could not find the desired user." });
    }

    // Connect to MongoDB and create GridFSBucket
    const mongoClient = MongoClient(mongoose.connection.db);
    const gridFSBucket = new GridFSBucket(mongoClient, { bucketName: "images" });

    // Create an upload stream to GridFS
    const uploadStream = gridFSBucket.openUploadStream(originalname, {
        contentType: mimetype,
    });

    // Pipe the image buffer to the upload stream
    buffer.pipe(uploadStream);

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        // Wait for the upload to complete
        uploadStream.on("finish", async () => {
            const portfolioShare = new Portfolio({
                user,
                file: {
                    fileId: uploadStream.id, // Store the fileId
                    filename: originalname,
                    contentType: mimetype,
                },
            });

            try {
                await portfolioShare.save({ session });
                existingUser.portfolioProp = portfolioShare;
                await existingUser.save({ session });
                await session.commitTransaction();
                session.endSession();

                return res.status(200).json({ portfolioShare });
            } catch (err) {
                console.log(err);
                await session.abortTransaction();
                session.endSession();
                return res.status(500).json({ message: "Error saving portfolio and user data" });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error uploading image" });
    }
};

export const updatePortfolio = async(req, res, next) =>{

    const {softwareUsed, description, careerOutcomes, image} = req.body;
    const portId = req.params.id;

    let portfolioUpdated;
    try{
        portfolioUpdated = await Portfolio.findByIdAndUpdate(portId, { image });
    }
    catch(err){
        console.log(err);
    }
    if(!portfolioUpdated){
        return res.status(500).json({message: "Portfolio was not updated."});
    }
    return res.status(200).json({portfolioUpdated});

}

export const getByID = async(req, res, next)=>{

    const portfolioID = req.params.id;

    let portfolioLink;
    try{
        portfolioLink = await Portfolio.findById(portfolioID);
    }
    catch(err){
        return console.log(err);
    }
    if(!portfolioLink){
        return res.status(404).json({message: "The portfolio that you are looking for does not exist."});
    }
    return res.status(200).json({portfolioLink});
}

export const deletePortfolio = async(req, res, next) =>{

    const portfolioID = req.params.id;

    let portfolioDeletion;
    try{
        portfolioDeletion = await Portfolio.findByIdAndDelete(portfolioID)
    }
    catch(err){
        console.log(err);
    }
    if (!portfolioDeletion){
        return res.status(500).json({message: "Unable to delete the portfolio."})
    }
    return res.status(200).json({message: "Deleted the portfolio at this location."})
}