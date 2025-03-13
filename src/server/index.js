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
import path from "path";

const app = express();
const port = 3001;

// Set the directory for static files
app.use(express.static("public"));

// Serve index.html when accessing "/"
app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
