import express from "express";
import routes from "./routes.js"; // Correct import path
import cors from 'cors'; // Import cors as an ES module

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(8000, () => {
    console.log('Server started on port 8000');
});