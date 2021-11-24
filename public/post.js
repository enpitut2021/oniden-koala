// ローカル動作確認のときコメントアウト
console.log("load!!")
liff.init({ //いろいろ初期化
    liffId: '1656528096-W6qpn7m3',
    // withLoginOnExternalBrowser: true,
}).then(() => { //初期化完了後にこれを実行
    console.log("liff inited")
    if (!liff.isLoggedIn()) {
        liff.login(); //ログインしていなかったらログイン
    }
    const line_profile = liff.getProfile()　 //プロフィール取得
    const line_id = line_profile.userId //lineIDの取得
    let element = document.getElementById('line_id');　
    element.value = line_id;
    console.log(document.getElementById('line_id').value)
}).catch((err) => { //エラー処理
    console.log(err);
});