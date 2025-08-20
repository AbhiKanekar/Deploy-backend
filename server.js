import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./utils/connectDB.js";
import authRoute from "./src/routes/auth.route.js"


dotenv.config();

const app = express();
app.use(cors(
    {
        origin: process.env.CLIENT_URL, 
         credentials: true,
    }
));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (_req, res) => res.send("api is running"));


app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 5000}`);
});