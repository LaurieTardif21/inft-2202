import express from "express";
import config from './config/config.js';

const app = express();
const port = 3000;

config(app);

app.use(express.static('dist'));   

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});