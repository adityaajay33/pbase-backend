import express from "express";  
import { getAllPortfolios, postPortfolio, updatePortfolio, getByID, deletePortfolio, getImageByID } from "../controllers/portfolio-controller";
import portfolio from "../model/portfolio";
import multer from "multer";
import { auth } from "../auth"

const upload = multer();

const portfolioRouter = express.Router();

portfolioRouter.get("/", getAllPortfolios);
portfolioRouter.post("/add", upload.single('file'), postPortfolio);
portfolioRouter.put("/update/:id", updatePortfolio);
portfolioRouter.get("/:id", getByID);
portfolioRouter.delete("/:id", deletePortfolio);
portfolioRouter.get("/images/:id", getImageByID)

export default portfolioRouter;
