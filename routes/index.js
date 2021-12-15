var router = require("express").Router();
const bot = require('@line/bot-sdk');
const db = require('../db/db');
const query = require('../db/query');
const myLiffId = process.env.MY_LIFF_ID;
const messagingApiToken = process.env.MESSAGING_API_TOKEN;
const client = new bot.Client({
    channelAccessToken: messagingApiToken
});

const promise = (querytext, param) => new Promise((resolve, reject) => {
    query(querytext, param).then(result => {
        resolve(result);
    })
})

router.get("/", function(req, res) {
    query('select users.username, cast(wakeup_date as TIME), comment, call_orders.call_id from call_orders, users where call_orders.user_id = users.user_id and call_orders.deleted = false;').then(result => {
        let data = {
            items: result
        };
        res.render("./index.ejs", data);
    })
});


router.get("/lineout-screen", function(req, res) {
    const exec = async() => {
        const res1 = await promise('select count(*) from topics;', )
        const min = 1;
        const max = res1[0]['count'];
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        const rand = randRange(min, max);
        const res2 = await promise('select call_orders.call_id, users.username, users.phone_number, cast(call_orders.wakeup_date as TIME), call_orders.comment, topics.topic from call_orders, users, topics where call_id = $1 and users.user_id = call_orders.user_id and topics.topic_id = $2;', [req.query.call_id, rand])
        const data = {
            items: res2
        }
        res.render("./lineout-screen.ejs", data)
    }
    exec();
});

router.get("/lineout-exec", function(req, res) {
    const exec = async () => {
        const line_id = req.query.line_id;
        // 電話番号を変数で受け取る
        const phone_number = req.query.phone_number;
        // DBにポイント加算記録
        await promise('insert into users (line_id, points) values ($1, 3) on conflict on constraint line_key do update set points = users.points + 3;', [line_id]) 
        // *鬼電希望出したことない人の名前はnull
        // ポイント獲得の通知メッセージを送る
        const message = {
            type: 'text',
            text: '３ポイント獲得しました！'
        };
        await client.pushMessage(line_id, message);
        // リダイレクト
        const url = "https://line.me/R/call/81/" + phone_number;
        res.writeHead(302, {
            'Location': url
        });
        res.end()
    }
    exec()
});

// 鬼電希望の削除用
router.get("/cancel-request", function(req, res) {

    const exec = async() => {
        promise("update call_orders set deleted = true where call_id = $1", [req.query.call_id]);
        res.send(req.query.call_id + "を削除しました<br><a href='/'>トップに戻る</a>");
    }
    exec();
});


router.get("/post-screen", function(req, res) {
    res.render("./post.ejs")
});

router.post("/post-screen", function(req, res) {
    if (req.body.wakeup_date == '') {
        res.send("起きたい時間が設定されていません。設定してから再送信してください。")
    } else if (req.body.line_id == '') {
        res.send("LINEのユーザーIDを取得できませんでした。")
    } else if (req.body.consent == 'on') {

        const exec = async() => {
            const res1 = await promise("INSERT INTO users (username, phone_number, line_id) VALUES ($1, $2, $3) ON CONFLICT ON CONSTRAINT line_key DO UPDATE SET username=$1, phone_number=$2returning user_id;", [req.body.username, req.body.phone_number, req.body.line_id]);
            const user_id = res1[0]['user_id'];
            promise("insert into call_orders (user_id, wakeup_date, comment, consent, topic_id) values ($1, $2, $3, TRUE, 1)", [user_id, req.body.wakeup_date, req.body.comment]);
            res.send("Received POST Data!<br><a href='/'>トップに戻る</a>");
        }
        exec();
    } else {
        res.send("起こしてくれる人を募集するには、送信ページの同意ボタンにチェックを入れてください。")
    }
});

router.get("/reserve", function(req, res) {
    //起こす予約ボタンが押されたときに、その投稿がもつ端末IDを取得
    //→そのIDのところのサーバーにアクセスしてメッセージ送信
    //call_idの取得
    const exec = async() => {
        const res1 = await promise("select user_id from call_orders where call_id = $1;", [req.query.call_id]); //取れてきたレコード一つ入る
        const user_id = res1[0]['user_id'];
        const res2 = await promise("select line_id from users where user_id = $1;", [user_id]);
        const line_id = res2[0]['line_id']

        const message = {
            type: 'text',
            text: 'あなたの鬼電希望に答えてくれる予約者が現れました！'
        };

        await client.pushMessage(line_id, message);
    }
    exec();
    res.send("起こす予約をしました<br><a href='/'>トップに戻る</a>");

});

router.get('/send-id', function(req, res) {
    res.json({ id: myLiffId });
});

module.exports = router;