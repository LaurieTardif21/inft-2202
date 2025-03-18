/*
import express from "express";
import config from './service/config.js';

const app = express();
const port = 3001;

app.use(express.static('public'));  

config(app); 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
*/


import express from "express";

const app = express();
const port = 3001;

app.use(express.static('public')); //add this line

app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
}); 