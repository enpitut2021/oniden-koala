console.log("load!!")

//コールボタンを押した時の動作
async function call_button(phone) {
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

      // 取得できてるか確認
      console.log(line_id);


      const call_url = '/lineout-exec?line_id=' + line_id + '&phone_number=' + phone;
      location.href = call_url;
    }
  }).catch((err) => { //エラー処理
    console.log(err);
  });
}



// 削除のボタン操作とか

function deleteConfirm(cid) {
    const confirmation = confirm("この鬼電希望を削除します。\nよろしいですか？");

    if (confirmation) {
        console.log("削除操作するとこ");
        location.href = "/cancel-request?call_id=" + cid;
    } else {
        // キャンセルしたとき（あれば）
    }


}