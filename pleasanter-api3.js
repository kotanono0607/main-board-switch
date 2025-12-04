// === Pleasanter サイドカーAPIクライアント (121624テーブル用) Ver1 ===
// 既存コードに影響を与えず、別テーブルを取得してコンソールに出力するだけ
(function (w) {
  "use strict";

  /* ---------- 設定 ---------- */
  var 設定 = {
    urlBase: "http://gwsv.nanyo-ad.ad.nanyo/api/items", // /{tableId}/get を後置
    tableId: 121624,
    apiKey : "f2ae46b2fd9669a23313a1230dd3b7ecc094ffc16b0798ae156d940a2be85b5395f44bac9eb20058143500a3c0d56b6c76d4f00acc842a08ff4748ab0beb2f46"
  };

  /* ---------- 応答検証 ---------- */
  async function 応答確認(res) {
    var raw = await res.text();
    var json; try { json = JSON.parse(raw); } catch (e) { json = {}; }
    if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
    var r = (json && json.Response) ? json.Response : {};
    if (r && r.IsSuccess === false) throw new Error(r.Message || "IsSuccess=false");
    return r;
  }

  /* ---------- 1ページ分取得 ---------- */
  async function 一ページ取得(offset) {
    var url = 設定.urlBase + "/" + 設定.tableId + "/get";
    var body = {
      ApiVersion: 1.1,
      ApiKey    : 設定.apiKey,
      Offset    : offset,
      View      : { Conditions: [] }
    };
    var res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });
    var r = await 応答確認(res);
    var rows      = Array.isArray(r && r.Data) ? r.Data : [];
    var total     = Number((r && r.TotalCount) || 0);
    var pageSize  = Number((r && r.PageSize) || (rows.length || 200));
    var currentOf = Number((r && r.Offset) || offset);
    var nextOffset= currentOf + pageSize;
    return { rows, total, pageSize, currentOf, nextOffset };
  }

  /* ---------- 公開API ---------- */
  async function レコード取得() {
    var 収集 = [], offset = 0;
    for (var i = 0; i < 2000; i++) {
      var ページ = await 一ページ取得(offset);
      var rows = ページ.rows, total = ページ.total, nextOffset = ページ.nextOffset;
      if (!rows.length) break;
      Array.prototype.push.apply(収集, rows);
      console.log("121624 取得: offset=" + ページ.currentOf + ", pageSize=" + ページ.pageSize + ", 収集=" + 収集.length + "/" + (total || "?"));
      if (total && nextOffset >= total) break;
      offset = nextOffset;
    }
    w._recordsCache_121624 = 収集;
    return 収集;
  }

  w.PleasanterApi_121624 = { レコード取得 };

  console.log("▶ PleasanterApi_121624 初期化完了（テーブルID: " + 設定.tableId + "）");

  /* ---------- 自動実行：読み込み完了後に一度だけ ---------- */
  (function 自動取得() {
    if (document.readyState === "complete") {
      取得して出力();
    } else {
      window.addEventListener("load", 取得して出力, { once: true });
    }
    async function 取得して出力() {
      try {
        var recs = await w.PleasanterApi_121624.レコード取得();
        console.log("★ 別テーブル(121624) 件数:", recs.length);
        console.log("★ 先頭サンプル(最大5件):", recs.slice(0, 5));
      } catch (e) {
        console.error("別テーブル(121624) 取得失敗:", e && e.message ? e.message : e);
      }
    }
  })();

})(window);
