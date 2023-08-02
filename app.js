import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes";
import portfolioRouter from "./routes/portfolio-routes";
import dotenv from "dotenv";
import cors from "cors";
import {auth} from "./auth";

const app = express();

app.use(cors()); 
app.use(express.json());
app.use("/api/user", router);
app.use("/api/portfolios", portfolioRouter);

dotenv.config();

console.log(process.env.DATABASE_URL);
console.log(process.env.PORT);

mongoose.connect(process.env.DATABASE_URL).then(()=>app.listen(5000)).then(()=>console.log("Connected.")).catch((err)=>console.log(err));

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