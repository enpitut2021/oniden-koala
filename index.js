const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const myLiffId = process.env.MY_LIFF_ID;

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use("/", require("./routes/index"))

app.listen(port, () => console.log(`app listening on port ${port}!`));