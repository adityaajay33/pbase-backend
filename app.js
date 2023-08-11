import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes";
import portfolioRouter from "./routes/portfolio-routes";
import dotenv from "dotenv";
import cors from "cors";
import { auth } from "./auth";
import multer from "multer"
import { MongoClient } from "mongodb"

const app = express();

app.use(cors()); 
app.use(express.json());
app.use("/api/user", router);
app.use("/api/portfolios", portfolioRouter);

dotenv.config();

const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });


mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>app.listen(5000)).then(()=>console.log("Connected.")).catch((err)=>console.log(err));

export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
  

app.use("/api", (req, res, next) =>{

    res.send("hello");
})

app.get("/free-endpoint", (req, res) => {
    res.json({ message: "You are free to access me anytime" });
});

app.get("/auth-endpoint", auth, (request, res) => {
    res.json({ message: "You are authorized to access me" });
});