import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

export async function dbConnect() {
  mongoose
    .connect(
        process.env.DATABASE_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    .then(() => {
      console.log("Successfully connected to MongoDB.");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB.");
      console.error(error);
    });
}
