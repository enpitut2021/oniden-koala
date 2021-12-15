const express = require('express');
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
    const ngrok = require("ngrok");
    ngrok.connect(port).then((url) => {
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
            console.log(`Example app listening at ${url}`);
        });
    })
} else {
    const ngrok = require("ngrok");
    ngrok.connect(port).then((url) => {


        const main = async () => {
            app.listen(port, () => {
                console.log(`Example app listening at http://localhost:${port}`);
                console.log(`Example app listening at ${url}`);
            });
            const config = {
                restApiId: "dy2e4aur09",
                resourceId: "iyfvxzzk6i",
                httpMethod: "ANY",
                port: port,
            }

            const execSync = require('child_process').execSync
            execSync(`aws apigateway put-integration --rest-api-id ${config.restApiId} --resource-id ${config.resourceId} --http-method ${config.httpMethod} --type HTTP_PROXY --integration-http-method ${config.httpMethod} --uri ${url}`)
            execSync(`aws apigateway create-deployment --rest-api-id ${config.restApiId} --stage-name prod`)
            console.log(`https://${config.restApiId}.execute-api.ap-northeast-1.amazonaws.com/prod`)
        }
        main();
    });
}