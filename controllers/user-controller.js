import User from "../model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { getByID } from "./portfolio-controller";
import Portfolio from "../model/portfolio";

export const getAllUser = async(req, res, next) =>{
    let users;
    try{
        users = await User.find();
    } catch (err) {
        return console.log(err);
    }
    if(!users){
        return res.status(404).json({message: "No users found."})
    }
    return res.status(200).json({users});
}

export const signup = async(req, res, next) =>{
    const{firstName, lastName, institution, email, password} = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({email})
    }
    catch(err){
        return console.log(err)
    }
    if (existingUser){
        return res.status(400).json({message: "User already exists."});
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        institution,
        email,
        password:hashedPassword
    });

    try{
        await newUser.save();
    }
    catch (err) {
        return console.log(err);
    }
    return res.status(201).json({newUser});
}

export const login = async(req, res, next) =>{
    const {email, password} = req.body;

    let users;
    try{
        users = await User.findOne({email});
    } catch (err) {
        return console.log(err);
    }
    if(!users){
        return res.status(404).json({message: "Incorrect username or password."})
    }
    
    const isPasswordCorrect = bcrypt.compareSync(password, users.password);
    if(!isPasswordCorrect){
        return res.status(404).json({message:"Incorrect username or password."})
    }

    const token = jwt.sign(
        {
          userId: users._id,
          userEmail: users.email,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h" }
    );

    return res.status(200).json({message: "Login successful.", token});
}

export const getByUserID = async(req, res, next)=>{

    const userID = req.params.id;

    let userLink;
    try{
        userLink = await User.findById(userID);
    }
    catch(err){
        return console.log(err);
    }
    if(!userLink){
        return res.status(404).json({message: "The portfolio that you are looking for does not exist."});
    }
    return res.status(200).json({userLink});
}

export const deleteByID = async(req, res, next)=>{

    const userID = req.params.id;

    let existingUser;
    try{
        existingUser = await User.findByIdAndDelete(userID);
    }
    catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(404).json({message: "Could not delete the user at this location."})
    }
    return res.status(200).json({message: "Deleted the user profile at this location."})
}

export const getFileIDByImageID = async (req, res, next) =>{
    try{
        const userID = req.params.id;

        let existingUser;
        try{
            existingUser = await User.findById(userID);
        }
        catch(err){
            return console.log(err);
        }
        if(!existingUser){
            return res.status(404).json({message: "The portfolio that you are looking for does not exist."});
        }

        const portfolioID = existingUser.portfolioProp;

        console.log(portfolioID);

        const idList = [];

        for(let obj of portfolioID){
            const obj1 = obj.toString();
            let portfolioLink;
            try{
                portfolioLink = await Portfolio.findById(obj1);
            }
            catch(err){
                return console.log(err);
            }
            if(!portfolioLink){
                return res.status(404).json({message: "The portfolio that you are looking for does not exist."});
            }
            const fileIDData = portfolioLink.file.fileId;
            console.log(fileIDData);

            idList.push(fileIDData);
        }
            
        
        console.log(portfolioID);
        return res.status(200).json({idList});
    }
    catch(error){

        console.log("Error"+ error);
        return res.status(400).json({message: "There was an error retrieving the data."});
    }

    
}
