// 削除のボタン操作とか

function deleteConfirm() {
  const confirmation = confirm("この鬼電希望を削除します。\nよろしいですか？");

  if (confirmation) {
    console.log("削除操作するとこ");
  } else {
    // キャンセルしたとき（あれば）
  }
}
