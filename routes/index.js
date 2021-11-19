var router = require("express").Router();
const db = require('../db/db');
const query = require('../db/query');
const myLiffId = process.env.MY_LIFF_ID;

const promise = (querytext, param) => new Promise((resolve, reject) => {
    query(querytext, param).then(result => {
        resolve(result);
    })
})

router.get("/", function (req, res) {
    query('select users.username, cast(wakeup_date as TIME), comment, call_orders.call_id from call_orders, users where call_orders.user_id = users.user_id;').then(result => {
        let data = {
            items: result
        };
        res.render("./index.ejs", data);
    })
});


router.get("/lineout-screen", function (req, res) {
    const exec = async () => {
        const res1 = await promise('select count(*) from topics;',)
        const min = 1;
        const max = res1[0]['count'];
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        const rand = randRange(min, max);
        const res2 = await promise('select users.username, users.phone_number, call_orders.wakeup_date, call_orders.comment, topics.topic from call_orders, users, topics where call_id = $1 and users.user_id = call_orders.user_id and topics.topic_id = $2;', [req.query.call_id, rand])
        const data = {
            items: res2
        }
        res.render("./lineout-screen.ejs", data)
    }
    exec();
});

// 鬼電希望の削除用
router.get("/cancel-request", function (req, res) {
  

  res.send(req.query.call_id + "を削除しました（してない）");
});


router.get("/post-screen", function (req, res) {
    res.render("./post.ejs")
});

router.post("/post-screen", function (req, res) {
    if (req.body.wakeup_date == '') {
        res.send("起きたい時間が設定されていません。設定してから再送信してください。")
    } else if (req.body.consent == 'on') {

        const exec = async () => {
            const res1 = await promise("insert into users (username, phone_number) values ($1, $2)returning user_id;", [req.body.username, req.body.phone_number]);
            const user_id = res1[0]['user_id'];
            promise("insert into call_orders (user_id, wakeup_date, comment, consent, topic_id) values ($1, $2, $3, TRUE, 1)", [user_id, req.body.wakeup_date, req.body.comment]);
            res.send("Received POST Data!");
        }
        exec();
    } else {
        res.send("起こしてくれる人を募集するには、送信ページの同意ボタンにチェックを入れてください。")
    }
});

router.get('/send-id', function (req, res) {
    res.json({ id: myLiffId });
});

module.exports = router;
