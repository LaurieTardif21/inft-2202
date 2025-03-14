/*
import express from "express";
const app = express();
const port = 3001;

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
*/

import express from "express";
import config from './service/config.js';

import path from "path";
import { fileURLToPath } from "url"; // Required for ES module compatibility

const app = express();
const port = 3001;
config(app);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static("public"));


// Serve index.html when accessing "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve list.html when accessing "/list"
app.get("/list", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "list.html"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});