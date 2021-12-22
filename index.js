const { execSync } = require('child_process');
const express = require('express');
const ngrok = require("ngrok");
const app = express();
const port = process.env.PORT || 8080;
const BEARER = process.env.BEARER;
const MY_LIFF_ID = process.env.MY_LIFF_ID;


app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use("/", require("./routes/index"))

if (process.env.NODE_ENV == "pure") {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
} else {
    ngrok.connect(port).then((url) => {
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
            console.log(`Example app listening at ${url}`);
            const shell = `curl -XPUT \
    -H "Authorization: Bearer ${BEARER}" \
    -H "Content-Type: application/json" \
    -d '{
    "view": {
        "type": "full",
        "url": "${url}"
    }
    }' \
    https://api.line.me/liff/v2/apps/${MY_LIFF_ID}`
            execSync(shell)
        });
    })
}

