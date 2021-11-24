// 削除のボタン操作とか

function deleteConfirm(cid) {
  const confirmation = confirm("この鬼電希望を削除します。\nよろしいですか？");

  if (confirmation) {
    console.log("削除操作するとこ");
    location.href = "/cancel-request?call_id="+cid;
  } else {
    // キャンセルしたとき（あれば）
  }
}
