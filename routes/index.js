var router = require("express").Router();
const db = require('../db/db');


router.get("/", function (req, res) {
    db.pool.connect((err, client) => {
        if (err) {
            res.send(err)
        } else {
            client.query('select users.username, cast(wakeup_date as TIME), comment, call_orders.call_id from call_orders, users where call_orders.user_id = users.user_id;', (err, result) => {
                let num = result.rows;
                let data = {
                    items: num
                };
                // レンダリングを行う
                res.render("./index.ejs", data);
            });
        }
    });
});


router.get("/lineout-screen", function (req, res) {
    db.pool.connect((err, client) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            client.query(`select users.username, users.phone_number, call_orders.wakeup_date, call_orders.comment, topics.topic from call_orders, users, topics where call_id = ${req.query.call_id} and users.user_id = call_orders.user_id;`, (err, result) => {
                let num = result.rows;
                let data = {
                    items: num
                };
                console.log(data)
                // レンダリングを行う
                res.render("./lineout-screen.ejs", data);
            });
        }
    });
});

router.get("/post-screen", function (req, res) {
    res.render("./post.ejs")
});

router.post("/post-screen", function (req, res) {
    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.phone_number);
    if (req.body.wakeup_date == '') {
        res.send("起きたい時間が設定されていません。設定してから再送信してください。")
    } else if(req.body.consent == 'on') {
        db.pool.connect((err, client) => {
            if (err) {
                console.log(err);
                res.send(err)
            } else {
                client.query(`insert into users (username, phone_number) values ('${req.body.username}', '${req.body.phone_number}')returning user_id;`, (err, result) => {
                    const num = result.rows[0]['user_id'];
                    client.query(`insert into call_orders (user_id, wakeup_date, comment, consent, topic_id) values (${num}, '${req.body.wakeup_date}', '${req.body.comment}', TRUE, 1)`, (err, result) => {
                        console.log(err)
                        res.send("Received POST Data!");
                    });
                });
            }
        });
    } else {
        res.send("起こしてくれる人を募集するには、送信ページの同意ボタンにチェックを入れてください。")
    }
});

module.exports = router;