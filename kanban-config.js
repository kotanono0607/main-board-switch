/* ===============================================================
 * kanban-config.js（修正版）
 *  - 共通設定
 *  - 右は「サーバー室」を固定表示（画像URLを直指定可）
 *  - 左メニューからは「サーバー室」を選べない想定
 * ============================================================= */
(function (w) {
  "use strict";

  w.Kanban設定 = {
    /* ----- 画面/動作設定 ----- */
    最大初期ラベル件数: 600,
    // ※左パネルの初期表示用画像URL（従来どおり）
    画像URL: "http://gwsv.nanyo-ad.ad.nanyo/binaries/ca99877de46e49209e22505783aecdb3/download",
    丸め関数: v => Math.round(v),

    /* ----- 座標保存先（NumHash配下のキー名）----- */
    フィールド名_X: "NumX",
    フィールド名_Y: "NumY",
    // 右パネル（固定パネル）用キー
    フィールド名_X右: "NumX2",
    フィールド名_Y右: "NumY2",
    書込キー直下: false, // true: NumX/NumY を直下列へ保存

    /* ----- フレーム（iframe）配置（左：可変フレーム） ----- */
    枠: { top: "100px", left: "900px", width: "50%", height: "700px" },

    /* ----- 画像メニュー設定（左のみで使用） ----- */
    // ★メニューからは「サーバー室」を選べない想定：候補に含めない
    画像候補: [
      { 名前: "会計課",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/ca99877de46e49209e22505783aecdb3/download" },
      { 名前: "総務課",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/33b2962151454ad5a33060a966dc91e3/download" },
      { 名前: "みらい戦略課",     url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/6cda8707821b4777a65807240100e717/download" },
      { 名前: "文化会館",         url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/83a5dde548174ffd9470288b889711d2/download" },
      { 名前: "財政課",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/40df8bf1bc854617a6cce70eb1542201/download" },
      { 名前: "総合防災課",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/9c4332733f0f49c2b5bd9236de7072ca/download" },
      { 名前: "税務課",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/c9054477dcae417e9a0de8aef707c959/download" },
      { 名前: "福祉課", url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/8019772261e0455d81ca6039569e5484/download" },
      { 名前: "すこやか子育て課", url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/4961e7f3f94e415a9c4c605e7592308a/download" },
      { 名前: "市民課",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/ed2cfcbe41e04762a0a20191b36b8d75/download" },
      { 名前: "商工観光課",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/172dc261d00c4b6e9e1ca5f619fae2de/download" },
      { 名前: "農林課",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/6fe291e025b74bf8abd6f12610ac8e30/download" },
      { 名前: "建設課",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/254aca35234d418cbd8f753cd5f3389d/download" },
      { 名前: "上下水道課",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/d48e5e8296674a298406dbb796ec6a76/download" },
      { 名前: "議会事務局",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/565bed458358482a94cf2d2de310fd48/download" },
      { 名前: "学校教育課",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/f0b8ebfeff2844f680126b79ff7dcb1b/download" },
      { 名前: "管理課",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/5d34ca0341884ababb5e9b4415b1a2ea/download" },
      { 名前: "社会教育課",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/b695f3396b9646f89d751892043fd8b4/download" },
      { 名前: "選管事務局",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/0f6e4b4156914ba58f7b46af094f52b7/download" },
      { 名前: "監査事務局",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/50a434497537452c99208c575afa5e8e/download" },
      { 名前: "農委事務局",       url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/9caa61ec657040449e5277e9306d2215/download" },
      { 名前: "管理職",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/d6ca27a191c24d288b0e6c8587c2c509/download" },
      { 名前: "その他",           url: "http://gwsv.nanyo-ad.ad.nanyo/binaries/198ed8c7035a4215bf94475be294176f/download" }
    ],
    画像切替でラベルを消す: true,
    メニュー幅px: 200,

    /* ----- メニュー選択時の再取得・抽出条件 ----- */
    メニュー選択で抽出: {
      対象フィールド: "ClassO" // 画像ボタン「名前」と一致するレコードを左に
    },

    /* ----- 初期表示時の抽出（左パネル） ----- */
    // ★「サーバー室」以外を初期抽出（従来値が既にサーバー室以外ならそのままでOK）
    初期抽出: { 対象フィールド: "ClassO", 値: "会計課" },

    /* ===== 右側は“サーバー室”に固定 ===== */
    固定右フレーム: {
      有効: true,
      画像名: "サーバー室",
      // ★右パネル画像を確実にサーバー室へ：候補に無くてもこのURLを使う
      画像URL: "http://gwsv.nanyo-ad.ad.nanyo/binaries/8f9947adb5d74e7fa316e3e868dc9661/download",
      抽出フィールド: "ClassO",
      枠: { top: "100px", right: "10px", width: "10%", height: "700px" }
    },

    /* ===== ClassCごとの色（背景＋枠線） ===== */
    ラベル色マップ: {
      "個人番号利用事務セグメント": { 背景: "#ffe5e5", 枠線: "#f5aaaa" },
      "LGWANセグメント":           { 背景: "#e6f0ff", 枠線: "#99bbee" },
      "インターネット接続セグメント":     { 背景: "#e8f7e8", 枠線: "#88cc88" }
    }
  };
})(window);
