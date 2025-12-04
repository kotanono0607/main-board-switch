/* ===============================================================
 * pleasanter-update-api.js
 *   - Pleasanter レコード更新 専用ラッパー（絶対URL固定版）
 *   - 利用側は window.PleasanterUpdateApi.レコード更新(id, 更新オブジェクト)
 *     を呼び出してください。
 * ============================================================= */
(function (w) {
  "use strict";

  /* ---------- 設定（絶対URL） ---------- */
  // 例: http://<host>/api/items/{id}/update に POST
  const 設定 = {
    itemsBaseUrl: "http://gwsv.nanyo-ad.ad.nanyo/api/items", // ←絶対URL（/api/items まで）
    apiKey: "f2ae46b2fd9669a23313a1230dd3b7ecc094ffc16b0798ae156d940a2be85b5395f44bac9eb20058143500a3c0d56b6c76d4f00acc842a08ff4748ab0beb2f46"
  };

  /* ---------- 共通ユーティリティ ---------- */
  // 応答検証（HTTP/アプリ両方のエラーを拾う）
  async function 応答確認(res) {
    const raw = await res.text();
    let json;
    try { json = JSON.parse(raw); } catch { json = {}; }

    if (!res.ok) {
      console.error("サーバー応答本文(raw):", raw);
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    if (json?.Response?.IsSuccess === false) {
      throw new Error(json.Response?.Message || "IsSuccess=false");
    }
    return json?.Response || {};
  }

  // ハッシュ（JSON/オブジェクト両対応）にキーを追加/更新して返す
  function ハッシュ更新(src, key, value) {
    let obj = {};
    if (typeof src === "string" && src) {
      try { obj = JSON.parse(src); } catch { obj = {}; }
    } else if (src && typeof src === "object") {
      obj = { ...src };
    }
    obj[key] = value;
    return obj;
  }

  /* ---------- レコード更新本体 ---------- */
  // id: ResultId（または IssueId）
  // updates: 例）{ Title:"新タイトル", DescriptionHash:{...}, Revision:3, ... }
  async function レコード更新(id, updates) {
    if (id == null) throw new Error("id が未指定です");

    // 絶対URLで更新エンドポイントを生成
    const url = `${設定.itemsBaseUrl}/${encodeURIComponent(id)}/update`;

    // 可能なら画面キャッシュから Revision を補完（任意）
    const cached = w._recordsCache?.find(r => Number(r.ResultId ?? r.IssueId) === Number(id));
    const bodyObj = {
      ApiVersion: 1.1,
      ApiKey: 設定.apiKey,
      ...(updates || {})
    };
    if (cached && typeof cached.Revision === "number" && bodyObj.Revision == null) {
      bodyObj.Revision = cached.Revision;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(bodyObj)
    });

    return 応答確認(res);
  }

  /* ---------- 名前空間として公開 ---------- */
  w.PleasanterUpdateApi = {
    レコード更新,
    ハッシュ更新
  };

  console.log("▶ PleasanterUpdateApi 初期化完了（絶対URL版）");
})(window);