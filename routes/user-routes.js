import express from "express";
import { getAllUser, signup, login, getByUserID } from "../controllers/user-controller";

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getByUserID);
 
export default router;