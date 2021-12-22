document.addEventListener('DOMContentLoaded', function () {

    console.log("load!!")
    liff.init({ //いろいろ初期化
        liffId: '1656528096-W6qpn7m3',
        // withLoginOnExternalBrowser: true,
    }).then(async () => { //初期化完了後にこれを実行
        console.log("liff inited")
        if (!liff.isLoggedIn()) {
            console.log("not logged in")
            liff.login(); //ログインしていなかったらログイン
        } else {
            console.log("logged in")
            const line_profile = await liff.getProfile() //プロフィール取得
            const line_id = line_profile.userId //lineIDの取得

            // ticketsapi叩く
            fetch(`/get-tickets?line_id=${line_id}`)
                .then(async response => response.json()).then(async json => {
                    console.log(json)
                    // アカウントがある時
                    console.log(json.tickets[0].tickets);
                    const tickets = json.tickets[0].tickets; // チケット数

                    const element = document.getElementById('tickets'); // 表示
                    element.insertAdjacentText('beforeend', tickets + 'チケットを所有しています。');
                });

            // 取得できてるか確認
            console.log(line_id);
        }
    }).catch((err) => { //エラー処理
        console.log(err);
    });
});