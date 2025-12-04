// pleasanter-api.js（全件取得・互換版） Ver1.0
/* ===== 開始: pleasanter-api.js ===== */
/* ===============================================================
 * 目的：Pleasanter のアイテムを全件取得（正しいページング対応）
 * 対応：古い環境向けに ?. と ??、テンプレートリテラルを不使用
 * ポイント：
 *  - PageSize はサーバ側設定（クライアントで増やせない）
 *  - Offset をトップレベルで POST、応答の TotalCount/PageSize/Offset を参照して繰り返す
 * ============================================================= */
(function (w) {
  "use strict";

  /* ---------- 設定 ---------- */
  const 設定 = {
    // 日本語コメント：URL と APIキーは環境に合わせて書き換えてください
    url   : "http://gwsv.nanyo-ad.ad.nanyo/api/items/45208/get",
    apiKey: "f2ae46b2fd9669a23313a1230dd3b7ecc094ffc16b0798ae156d940a2be85b5395f44bac9eb20058143500a3c0d56b6c76d4f00acc842a08ff4748ab0beb2f46"
  };

  /* ---------- 応答検証 ---------- */
  // 日本語コメント：HTTP/アプリケーションエラーを検出し、Response オブジェクトを返す
  async function 応答確認(res) {
    const raw = await res.text();
    var json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      json = {};
    }

    if (!res.ok) {
      throw new Error("HTTP " + res.status + " " + res.statusText);
    }

    var response = (json && json.Response) ? json.Response : {};
    if (response && response.IsSuccess === false) {
      throw new Error(response.Message || "IsSuccess=false");
    }
    return response;
  }

  /* ---------- 1ページ分取得（Offsetのみ指定） ---------- */
  // ・PageSize はサーバ設定値が使われる
  // ・Offset はトップレベルで POST する
  async function 一ページ取得(offset) {
    // 日本語コメント：必要に応じて Conditions を追加してください
    const body = {
      ApiVersion: 1.1,
      ApiKey    : 設定.apiKey,
      Offset    : offset,             // ★ 重要：トップレベル
      View      : { Conditions: [] }  // 例）[{ ColumnName:"...", Operator:"=", Value:"..." }]
    };

    const res = await fetch(設定.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });

    const r = await 応答確認(res);

    // 応答からページ情報を読み取る（?. と ?? を使わない互換実装）
    const rows      = Array.isArray(r && r.Data) ? r.Data : [];
    const total     = Number((r && r.TotalCount) != null ? r.TotalCount : 0);
    const pageSize  = Number((r && r.PageSize)   != null ? r.PageSize   : (rows.length || 200));
    const currentOf = Number((r && r.Offset)     != null ? r.Offset     : offset);
    const nextOffset = currentOf + pageSize;

    return { rows: rows, total: total, pageSize: pageSize, currentOf: currentOf, nextOffset: nextOffset };
  }

  /* ---------- 主要API: レコード全件取得 ---------- */
  // 日本語コメント：全ページを順に取得し、配列で返します
  async function レコード取得() {
    const 収集 = [];
    let offset = 0;

    // 日本語コメント：過剰ループ防止の上限（必要に応じて調整）
    for (let i = 0; i < 2000; i++) {
      const ページ = await 一ページ取得(offset);
      const rows = ページ.rows;
      const total = ページ.total;
      const pageSize = ページ.pageSize;
      const currentOf = ページ.currentOf;
      const nextOffset = ページ.nextOffset;

      if (!rows.length) {
        break;
      }

      // 日本語コメント：取得済み配列へ追加
      Array.prototype.push.apply(収集, rows);

      // 進捗ログ（テンプレートリテラル不使用）
      console.log(
        "ページ取得: offset=" + currentOf +
        ", pageSize=" + pageSize +
        ", 収集=" + 収集.length + "/" + (total || "?")
      );

      // 全件に到達したら抜ける
      if (total && nextOffset >= total) {
        break;
      }

      // 次ページへ
      offset = nextOffset;
    }
    return 収集;
  }

  /* ---------- 公開 ---------- */
  // 日本語コメント：グローバル公開
  w.PleasanterApi = { レコード取得: レコード取得 };
  console.log("▶ PleasanterApi 初期化完了（全件取得・ページング対応・互換版）");
})(window);

/* ===== 終了: pleasanter-api.js ===== */
