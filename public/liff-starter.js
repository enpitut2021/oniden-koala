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
    const idToken = liff.getDecodedIDToken(); //ユーザーの情報を取得
    console.log(idToken);
}).catch((err) => { //エラー処理
    console.log(err);
});
