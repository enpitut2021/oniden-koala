// ローカル動作確認のときコメントアウト
console.log("load!!")
liff.init({ //いろいろ初期化
    liffId: '1656528096-W6qpn7m3',
    // withLoginOnExternalBrowser: true,
}).then( async () => { //初期化完了後にこれを実行
    console.log("liff inited")
    if (!liff.isLoggedIn()) {
        console.log("not logged in")
        liff.login(); //ログインしていなかったらログイン
    } else {
        console.log("logged in")
        const line_profile = await liff.getProfile() //プロフィール取得
        const line_id = line_profile.userId //lineIDの取得
        let element = document.getElementById('line_id');
        element.value = line_id;

        // 取得できてるか確認
        console.log(line_id);
        console.log(document.getElementById('line_id').value);
    }
}).catch((err) => { //エラー処理
    console.log(err);
});
