import express from "express";
import dotenv from 'dotenv';
import mainRouter from "./routes/main.js";

dotenv.config();
let PORT = process.env.PORT||4000;

let app = express();
app.use(express.json());


app.use("/api", mainRouter);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}th port`);
});
