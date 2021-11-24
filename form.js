"use strict";
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

let formArray = [{
    id: 1,
    titel: "Titel",
    artist: "Artist",
    minuut: 0,
    seconde: 15
}];

app.get('/', async (req, res) => {
    res.json(formArray);
});

app.post('/', async (req, res) => {
    let id = formArray.length + 1;
    const form = {
        id: id,
        titel: req.body.titel,
        artist: req.body.artist,
        minuut: Number(req.body.minuut),
        seconde: Number(req.body.seconde)
    };
    console.log(form);
    formArray.push(form);
    res.status(201).redirect('http://localhost:5500/index.html');
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}/`);
});