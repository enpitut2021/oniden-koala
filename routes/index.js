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
    const exec = async() => {
        const res1 = await promise("select users.username, TO_CHAR(wakeup_date, 'MM/DD HH24:MI') as wakeup_date, comment, call_orders.call_id from call_orders, users where call_orders.user_id = users.user_id and call_orders.deleted = false;", )
        let data = {
            items: res1,
        }
        res.render("./index.ejs", data)
    }
    exec();
});

router.get("/get-tickets", function(req, res) {
    const exec = async () => {
        const line_id = req.query.line_id;
        const res1 = await promise("select tickets from users where line_id  = $1", [line_id]);
        console.log(res1.length)
        console.log(res1)
        if (res1.length) {
            res.json({
                tickets: res1
            })
        } else {
            console.log('unknown user');
            const res2 = await promise("insert into users (username, line_id, tickets) values ('User', $1, 3)", [req.query.line_id]);
            console.log(res2);
            const res3 = await promise("select tickets from users where line_id  = $1", [line_id]);
            console.log(res3);
            res.json({
                tickets: res3
            })
        }
    }
    exec();
})


router.get("/lineout-screen", function(req, res) {
    const exec = async() => {
        const res1 = await promise('select count(*) from topics;', )
        const min = 1;
        const max = res1[0]['count'];
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        const rand = randRange(min, max);
        const res2 = await promise("select call_orders.call_id, users.username, TO_CHAR(wakeup_date, 'YYYY/MM/DD HH24:MI') as wakeup_date, call_orders.comment, topics.topic from call_orders, users, topics where call_id = $1 and users.user_id = call_orders.user_id and topics.topic_id = $2;", [req.query.call_id, rand])
        const data = {
            items: res2
        }
        res.render("./lineout-screen.ejs", data)
    }
    exec();
});

router.get("/lineout-exec", function(req, res) {
    const exec = async () => {
        const caller_id = req.query.line_id;
        // 電話番号を変数で受け取る
        const call_id = req.query.call_id;

        // Call ID に紐つくデータ取得
        // 電話相手の情報
        const callee = await promise("select u.line_id, u.phone_number from call_orders as c, users as u where c.user_id = u.user_id and c.call_id = $1;", [call_id]);

        // DBにポイント加算記録
        await promise("insert into users (username, line_id, tickets) values ('User', $1, 3) on conflict on constraint line_key do update set tickets = users.tickets + 3;", [caller_id]);

        // *鬼電希望出したことない人の名前はnull
        // ポイント獲得の通知メッセージを送る
        const message = {
            type: 'text',
            text: 'チケットを3枚獲得しました！'
        };
        await client.pushMessage(caller_id, message);

        //チケットの消費
        // await promise("insert into users (username, line_id, tickets) values ('User', $1, 0) on conflict on constraint line_key do update set tickets = users.tickets - 1;", [callee[0]['line_id']])
        // 消費できてる？？？（要検証） **********

        // リダイレクト
        const url = "https://line.me/R/call/81/" + callee[0]['phone_number'];
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

    // チケット足りない分岐: ユーザー情報まだわかんない
    // const status = ;

    // if (status[0]["tickets"]) {

    // }
    res.render("./post.ejs")
});

router.post("/post-screen", function(req, res) {

    if (req.body.wakeup_date == '') {
        res.send("起きたい時間が設定されていません。設定してから再送信してください。")
    } else if (req.body.line_id == '') {
        res.send("LINEのユーザーIDを取得できませんでした。")
    } else if (req.body.consent == 'on') {

        const exec = async() => {
            const res1 = await promise("INSERT INTO users (username, phone_number, line_id) VALUES ($1, $2, $3) ON CONFLICT ON CONSTRAINT line_key DO UPDATE SET username=$1, phone_number=$2 returning user_id;", [req.body.username, req.body.phone_number, req.body.line_id]);
            const user_id = res1[0]['user_id'];

            const tickets_curr = await promise ("select tickets from users where user_id = $1", [user_id]);
            // const tickets_curr_a = tickets_curr[0]["tickets"];
            // console.log("tickets_curr: "+tickets_curr_a);
            console.log(tickets_curr);
            if (tickets_curr[0].tickets > 0) {
                //チケットの消費
                await promise("insert into users (username, line_id, tickets) values ('User', $1, 0) on conflict on constraint line_key do update set tickets = users.tickets - 1;", [req.body.line_id]);
                //鬼電希望送信
                promise("insert into call_orders (user_id, wakeup_date, comment, consent, topic_id) values ($1, $2, $3, TRUE, 1)", [user_id, req.body.wakeup_date, req.body.comment]);
                res.send("鬼電希望を送信しました！<br><a href='/'>トップに戻る</a>");
            } else {
                res.send("チケットが足りません。<br>鬼電希望したい場合は、他の希望者を起こしてあげましょう。<br><a href='/'>トップに戻る</a>");
            }
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

// ランキング一覧
router.get('/ranking', function(req, res) {
    const exec = async() => {
        const res1 = await promise("select * from users order by points desc limit 3;");
        const data = {
            items: res1
        };
        res.render("./ranking-lineout.ejs", data);
    }
    exec();
});

router.get('/send-id', function(req, res) {
    res.json({ id: myLiffId });
});

module.exports = router;