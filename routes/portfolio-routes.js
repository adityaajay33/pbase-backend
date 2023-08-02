import express from "express";  
import { getAllPortfolios, postPortfolio, updatePortfolio, getByID, deletePortfolio } from "../controllers/portfolio-controller";
import portfolio from "../model/portfolio";
const portfolioRouter = express.Router();

portfolioRouter.get("/", getAllPortfolios);
portfolioRouter.post("/add", postPortfolio);
portfolioRouter.put("/update/:id", updatePortfolio);
portfolioRouter.get("/:id", getByID);
portfolioRouter.delete("/:id", deletePortfolio);

export default portfolioRouter;
