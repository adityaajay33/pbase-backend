import Portfolio from "../model/portfolio";
import User from "../model/User";
import mongoose from "mongoose";

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

export const postPortfolio = async(req, res, next) =>{
    const {softwareUsed, description, careerOutcomes, image, user} = req.body;

    let existingUser;
    try{
        existingUser = await User.findById(user);
    }
    catch(err){
        return console.log(err);
    }
    if (!existingUser){

        return res.status(404).json({message:"Could not find the desired user."})
    }


    const portfolioShare = new Portfolio({
        softwareUsed, 
        description, 
        careerOutcomes, 
        image, 
        user
    });

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await portfolioShare.save({session});
        existingUser.portfolioProp = portfolioShare;
        await existingUser.save({session});
        await session.commitTransaction();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "There is an error with the system."});
    }

    try{
        await portfolioShare.save()
    }
    catch(err){
        return console.log(err)
    }
    return res.status(200).json({portfolioShare});
};

export const updatePortfolio = async(req, res, next) =>{

    const {softwareUsed, description, careerOutcomes, image} = req.body;
    const portId = req.params.id;

    let portfolioUpdated;
    try{
        portfolioUpdated = await Portfolio.findByIdAndUpdate(portId, {softwareUsed, description, careerOutcomes, image});
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