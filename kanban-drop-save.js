// kanban-drop-save.js（ログ強化版） Ver 1.0.1
(function (w) {
  "use strict";

  function 丸(v) { return Math.round(Number(v) || 0); }

  function パネル相対に直す(detail, ctx) {
    const { x, y, area, clientX, clientY } = detail || {};
    if (!ctx || !ctx.レイヤ || !ctx.左パネル || !ctx.右パネル) return { x: null, y: null };

    const layerRect = ctx.レイヤ.getBoundingClientRect();
    const panelEl = (area === "右") ? ctx.右パネル : ctx.左パネル;
    const panelRect = panelEl.getBoundingClientRect();

    const offX = panelRect.left - layerRect.left;
    const offY = panelRect.top  - layerRect.top;

    const relX = (x != null && y != null)
      ? (Number(x) - offX)
      : (Number(clientX) - panelRect.left);
    const relY = (x != null && y != null)
      ? (Number(y) - offY)
      : (Number(clientY) - panelRect.top);

    return { x: 丸(relX), y: 丸(relY) };
  }

  function 構築_updates(x, y, area) {
    const S = w.Kanban設定 || {};
    const 直下 = !!S.書込キー直下;
    const KX = (area === "右")
      ? (S.フィールド名_X右 || "NumX2")
      : (S.フィールド名_X   || "NumX");
    const KY = (area === "右")
      ? (S.フィールド名_Y右 || "NumY2")
      : (S.フィールド名_Y   || "NumY");

    if (直下) {
      const obj = {}; obj[KX] = x; obj[KY] = y; return obj;
    }

    if (w.PleasanterUpdateApi && typeof w.PleasanterUpdateApi.ハッシュ更新 === "function") {
      let nh = "{}";
      nh = w.PleasanterUpdateApi.ハッシュ更新(nh, KX, x);
      nh = w.PleasanterUpdateApi.ハッシュ更新(nh, KY, y);
      return { NumHash: nh };
    }
    const nh = {}; nh[KX] = x; nh[KY] = y;
    return { NumHash: nh };
  }

  function 取得_画面キャッシュ() {
    return Array.isArray(w._recordsCache) ? w._recordsCache : null;
  }

  async function 保存(detail) {
    const id = detail && detail.id;
    const area = detail && detail.area;
    console.log("▶ 保存処理開始 detail=", detail);

    if (id == null) { console.warn("保存スキップ: id不明"); return; }
    if (!w.KanbanFrameSingle || !w.KanbanFrameSingle._ctx) {
      console.warn("保存スキップ: _ctx未初期化"); return;
    }

    const { x, y } = パネル相対に直す(detail, w.KanbanFrameSingle._ctx);
    if (x == null || y == null) { console.warn("保存スキップ: 座標null"); return; }

    const updates = 構築_updates(x, y, area);
    console.log(`▶ 保存準備 id=${id}, area=${area}, updates=`, updates);

    if (!w.PleasanterUpdateApi || typeof w.PleasanterUpdateApi.レコード更新 !== "function") {
      console.warn("保存スキップ: PleasanterUpdateApi.レコード更新 が未定義");
      return;
    }

    try {
      const result = await w.PleasanterUpdateApi.レコード更新(id, updates);
      console.log("▶ API応答:", result);

      const list = 取得_画面キャッシュ();
      if (list) {
        const rec = list.find(r => Number(r.ResultId ?? r.IssueId) === Number(id));
        if (rec) {
          const S = w.Kanban設定 || {};
          const KX = (area === "右") ? (S.フィールド名_X右 || "NumX2") : (S.フィールド名_X || "NumX");
          const KY = (area === "右") ? (S.フィールド名_Y右 || "NumY2") : (S.フィールド名_Y || "NumY");
          if (S.書込キー直下) { rec[KX] = x; rec[KY] = y; }
          else {
            let nh = rec.NumHash;
            try { if (typeof nh === "string") nh = JSON.parse(nh || "{}"); } catch { nh = {}; }
            if (!nh || typeof nh !== "object") nh = {};
            nh[KX] = x; nh[KY] = y; rec.NumHash = nh;
          }
          if (typeof rec.Revision === "number") rec.Revision += 1;
        }
      }
      console.log(`▶ 保存成功 id=${id} (${area}) x=${x}, y=${y}`);
    } catch (e) {
      console.error("▶ 保存失敗:", e && e.message ? e.message : e);
    }
  }

  function バインド() {
    if (w.__kanbanDropSaveBound) return;
    w.__kanbanDropSaveBound = true;

    w.addEventListener("kanban:drop", function (ev) {
      console.log("▶ kanban:drop 捕捉 detail=", ev && ev.detail);
      Promise.resolve().then(() => 保存(ev && ev.detail || {}));
    });

    console.log("▶ kanban-drop-save.js バインド完了（ログ強化版）");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function onr(){
      document.removeEventListener("DOMContentLoaded", onr);
      バインド();
    });
  } else {
    バインド();
  }
})(window);
