const ngrok = require("ngrok");
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;


app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use("/", require("./routes/index"))

if (process.env.NODE_ENV == "production") {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
} else {
    ngrok.connect(port).then((url) => {
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
            console.log(`Example app listening at ${url}`);
        });
    });
}