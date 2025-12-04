/* ===============================================================
 * kanban-menu.js（修正版）
 *  - 左側メニューから「サーバー室」を選べないよう除外
 *  - もし誤って「サーバー室」名が来ても無視
 * ============================================================= */
(function (w) {
  "use strict";

  async function フレーム準備を待つ(timeoutMs = 6000) {
    const t0 = Date.now();
    while (!w.KanbanFrameSingle?._ctx?.doc) {
      await new Promise(r => setTimeout(r, 30));
      if (Date.now() - t0 > timeoutMs) return null;
    }
    return w.KanbanFrameSingle._ctx;
  }

  function メニュースタイル(el) {
    el.style.position = "absolute";
    el.style.background = "#fff";
    el.style.border = "1px solid #ccc";
    el.style.borderRadius = "8px";
    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
    el.style.padding = "8px";
    el.style.zIndex = "9999";
    el.style.overflow = "auto";
    el.style.maxHeight = "80vh";
  }
  function ボタン(doc, label, active) {
    const b = doc.createElement("button");
    b.textContent = label;
    b.style.display = "block";
    b.style.width = "100%";
    b.style.textAlign = "left";
    b.style.padding = "8px 10px";
    b.style.margin = "4px 0";
    b.style.border = "1px solid #ddd";
    b.style.borderRadius = "6px";
    b.style.background = active ? "#e6f0ff" : "#fff";
    b.style.cursor = "pointer";
    b.onmouseenter = () => { if (!active) b.style.background = "#f7f7f7"; };
    b.onmouseleave = () => { if (!active) b.style.background = active ? "#e6f0ff" : "#fff"; };
    return b;
  }

  const KEY = "kanban.selectedImageUrl";
  const save = url => { try { localStorage.setItem(KEY, url); } catch {} };
  const load = () => { try { return localStorage.getItem(KEY) || ""; } catch { return ""; } };

  window.addEventListener("load", async () => {
    const s = w.Kanban設定; if (!s) return;

    const 固定名 = s?.固定右フレーム?.画像名 || "サーバー室";

    const menuWidth = Number(s.メニュー幅px || 200);
    const frameLeft = parseInt(String(s.枠.left), 10) || 700;
    const topPx = s.枠.top || "100px";

    const メニュー = document.createElement("div");
    メニュースタイル(メニュー);
    メニュー.style.top = topPx;
    メニュー.style.left = Math.max(10, frameLeft - (menuWidth + 20)) + "px";
    メニュー.style.width = menuWidth + "px";

    const 見出し = document.createElement("div");
    見出し.textContent = "画像メニュー";
    見出し.style.fontWeight = "700";
    見出し.style.margin = "4px 2px 8px";
    メニュー.appendChild(見出し);

    const last = load();
    const currentUrl = last || s.画像URL;

    // ★右固定名（サーバー室）はメニューに出さない
    (s.画像候補 || [])
      .filter(item => (item.名前 || "") !== 固定名)
      .forEach(item => {
        const btn = ボタン(document, item.名前 || item.url, item.url === currentUrl);
        btn.addEventListener("click", async () => {
          const ctx = await フレーム準備を待つ(); if (!ctx) return;
          if ((item.名前 || "") === 固定名) return; // 念のためガード

          // 左画像だけ差し替え
          if (ctx.左画像) ctx.左画像.src = item.url;
          save(item.url);

          // アクティブ更新
          Array.from(メニュー.querySelectorAll("button")).forEach(b => b.style.background = "#fff");
          btn.style.background = "#e6f0ff";

          // メニュー選択通知（名前で抽出用）
          window.dispatchEvent(new CustomEvent("kanban:imageSelected", {
            detail: { name: item.名前 || "", url: item.url }
          }));
        });
        メニュー.appendChild(btn);
      });

    document.body.appendChild(メニュー);

    // 復元（左画像へ適用）
    if (last && last !== s.画像URL) {
      const ctx = await フレーム準備を待つ(); if (ctx?.左画像) ctx.左画像.src = last;
    }
  });
})(window);
