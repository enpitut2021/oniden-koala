# やりたいこと - すること
- ## ローカルサーバー立ち上げたい

    - /.envファイルを追加

        この時.gitignoreによって、git管理されて**いない**ことを確認する。

        もしgit管理されていて、pushしてしまうと、重要なサーバー情報を漏洩することになるので注意

    - /.envファイルに環境変数を記述

        [Discord](https://discord.com/channels/862980148584382496/869560552060506112/907528794263420958)にて共有しています。そのままコピペしてください。

    - ターミナルで/index.jsがある場所にcdし、以下のコードをひとつずつ実行

        ```
        npm install（初回実行時のみ実行）
        heroku login（初回実行時のみ実行）
        git remote add heroku https://git.heroku.com/oniden-koala.git（初回実行時のみ実行）
        heroku local
        ```

- ## cssファイルを追加したい

    - /public配下に.cssファイル追加

- ## あたらしい画面を作りたい

    - /views配下に.ejsファイルを追加

    - /routes/index.jsに対応する処理を追加（[処理の書き方](https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/Introduction)）

# 動作の仕組み
/index.js が一番最初に参照される。
```
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());
```
上記はpost通信した内容をjson形式で取得するための設定。

**いじらないこと。**

```
app.use(express.static('public'));
```
上記は /public/ ディレクトリを静的ファイルの配信元として扱うための設定。

**いじらないこと。**

app.getでええんちゃう？って思ってる方は[この記事](https://www.i-ryo.com/entry/2020/04/16/215205#ressend%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%81%A7HTML%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B)みるといいと思うよ！

```
app.set('view engine', 'ejs');
```
上記はテンプレートエンジンとして使うミドルウェアを設定してる。

[テンプレートエンジンはこのくらい種類あるけど、](https://expressjs.com/en/resources/template-engines.html)好きなやつ使えばいい。今回は一般的なejsを使ったよ。

**いじらないこと。**

```
app.use("/", require("./routes/index"))
```

ルーティングの処理は長くなるから、/routes/index.jsに記述した。そして上記のコードでそのファイルを参照している。

**いじらないこと。**

```
app.listen(port, () => console.log(`app listening on port ${port}!`));
```
上記はサーバーを開くポートの指定をしている。Herokuの環境変数からport番号は取得しているよ。

**いじらないこと。**

# 各ディレクトリ・ファイルの説明
- ## /db/

    - db.jsにPostgresqlへの接続のための情報が記述されている。

        **いじらないこと。**

- ## /public/

    - 静的ファイルが置かれている。

        基本的にcssファイルのみここに置くこと。

- ## /routes/

    - /index.jsにimportされているファイルが格納されている。

        トップディレクトリのものであり、/routes/index.jsとは別物であることに注意

    - /routes/index.jsには、ブラウザでアクセスされたURLに紐づく処理が記述されている。

        後述するviewsに変数等を埋め込みたい場合はこのファイルに記述すること。

- ## /views/

    - routesによって呼び出されるテンプレートファイルが置かれている。

        文法等は、https://github.com/mde/ejs を参照

- ## /index.js

    - サーバーの動作や使用するミドルウェア等を記述している。

        文法等は、https://developer.mozilla.org/ja/docs/Learn/Server-side/Express_Nodejs/Introduction を参照