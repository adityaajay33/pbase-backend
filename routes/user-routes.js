import express from "express";
import { getAllUser, signup, login, getByUserID, deleteByID, getFileIDByImageID } from "../controllers/user-controller";

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getByUserID);
router.delete("/:id", deleteByID);
router.get("/userdata/:id", getFileIDByImageID);
 
export default router;