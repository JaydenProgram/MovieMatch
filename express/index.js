import express from "express";
import routes from "./routes.js"; // Correct import path

const app = express();

app.use(express.json());

app.use("/", routes);

app.listen(8000, () => {
    console.log('Server started on port 8000');
});