const bot = require('@line/bot-sdk');
const db = require('../../db/db');
const query = require('../../db/query');
const messagingApiToken = process.env.MESSAGING_API_TOKEN;
const client = new bot.Client({
    channelAccessToken: messagingApiToken
});

const promise = (querytext, param) => new Promise((resolve, reject) => {
    query(querytext, param).then(result => {
        resolve(result);
    })
})

const exec = async () => {
    const res1 = await promise("select users.line_id from reservations, users where reservations.notified = false and reservations.caller_id = users.user_id;");
    res1.forEach(elem => {
        const line_id = elem['line_id'];
        const message = {
            type: 'text',
            text: '予約した鬼電の時間が近づいてきました。'
        };

        client.pushMessage(line_id, message);
    });
    await promise("update reservations set notified = true;");
}
exec();