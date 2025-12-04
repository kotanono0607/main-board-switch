/* ===============================================================
 * kanban-labels-single.js
 *  - 共有ラベルレイヤ上でのラベル生成・ドラッグ移動・座標ポップ
 *  - ドロップ時に「左 or 右（サーバー室）」を判定し、top へ通知
 *      kanban:drop : { id, x, y, area, clientX, clientY, elLeft, elTop, elWidth, elHeight }
 *  - ★追加：ラベルをダブルクリックで http://gwsv.nanyo-ad.ad.nanyo/items/【レコード】 を新規タブで開く
 * ============================================================= */
(function (w) {
  "use strict";

  // どちらのパネルに落ちたかを判定（client座標で矩形ヒット）
  function ドロップ先エリア(doc, clientX, clientY) {
    const 左 = doc.getElementById("左パネル");
    const 右 = doc.getElementById("右パネル");
    const lr = 左.getBoundingClientRect();
    const rr = 右.getBoundingClientRect();
    const 左内 = clientX >= lr.left && clientX <= lr.right && clientY >= lr.top && clientY <= lr.bottom;
    const 右内 = clientX >= rr.left && clientX <= rr.right && clientY >= rr.top && clientY <= rr.bottom;
    if (右内) return "右";
    if (左内) return "左";
    return "外";
  }

  // ラベル生成（第7引数: オプション { 背景色, 枠線色 }）
  function ラベル作成(doc, layer, テキスト, left, top, recId, オプション) {
    const s = w.Kanban設定;

    const ラベル = doc.createElement("div");
    ラベル.className = "ラベル";
    ラベル.style.left = (left || 40) + "px";
    ラベル.style.top  = (top  || 40) + "px";
    if (recId != null) ラベル.dataset.id = String(recId);

    // ★ラベルをダブルクリックした時に、対象レコードをPleasanter画面で開く
    ラベル.addEventListener("dblclick", function () {
      // recId 優先。無ければ data-id を利用
      const id = recId != null ? recId : (ラベル.dataset && ラベル.dataset.id);
      if (id != null && id !== "") {
        const url = "http://gwsv.nanyo-ad.ad.nanyo/items/" + String(id);
        window.open(url, "_blank"); // 新しいタブで開く
      }
    });

    // 背景色/枠線色の上書き（指定があれば既定CSSを上書き）
    if (オプション) {
      if (オプション.背景色) {
        ラベル.style.background = オプション.背景色;
      }
      if (オプション.枠線色) {
        ラベル.style.border = `1px solid ${オプション.枠線色}`;
      }
    }

    const 丸 = doc.createElement("span"); 丸.className = "丸";
    const 本文 = doc.createElement("span"); 本文.textContent = テキスト || "ラベル";
    const 削除 = doc.createElement("button"); 削除.className = "削除"; 削除.textContent = "×";
    削除.addEventListener("click", (e) => { e.stopPropagation(); ラベル.remove(); ポップ非表示(); });
    ラベル.append(丸, 本文, 削除);

    // 座標ポップ（共有1個）
    const 既存 = layer.querySelector(".座標ポップ");
    const 座標ポップ = 既存 || (() => {
      const p = doc.createElement("div");
      p.className = "座標ポップ";
      p.style.display = "none";
      layer.appendChild(p);
      return p;
    })();
    function ポップ表示(x, y, el) {
      座標ポップ.textContent = `X: ${s.丸め関数(x)}, Y: ${s.丸め関数(y)}`;
      const r = layer.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      座標ポップ.style.left = (er.left + er.width / 2 - r.left) + "px";
      座標ポップ.style.top  = (er.top - r.top) + "px";
      座標ポップ.style.display = "block";
    }
    function ポップ非表示(){ 座標ポップ.style.display = "none"; }

    // ドラッグ処理
    let ドラッグ中 = null;
    ラベル.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const r = layer.getBoundingClientRect();
      ドラッグ中 = {
        el: ラベル,
        startX: e.clientX - r.left,
        startY: e.clientY - r.top,
        baseLeft: parseFloat(ラベル.style.left) || 0,
        baseTop : parseFloat(ラベル.style.top)  || 0
      };
      if (ラベル.setPointerCapture) ラベル.setPointerCapture(e.pointerId);
      ポップ表示(ドラッグ中.baseLeft, ドラッグ中.baseTop, ラベル);
      w.dispatchEvent(new CustomEvent("kanban:dragstart", { detail: { el: ラベル } }));
    });

    doc.defaultView.addEventListener("pointermove", (e) => {
      if (!ドラッグ中) return;
      const r = layer.getBoundingClientRect();
      let x = ドラッグ中.baseLeft + ((e.clientX - r.left) - ドラッグ中.startX);
      let y = ドラッグ中.baseTop  + ((e.clientY - r.top ) - ドラッグ中.startY);
      x = Math.max(0, Math.min(x, r.width  - ラベル.offsetWidth));
      y = Math.max(0, Math.min(y, r.height - ラベル.offsetHeight));
      ラベル.style.left = x + "px";
      ラベル.style.top  = y + "px";
      ポップ表示(x, y, ラベル);
    });

    // 画面基準の矩形も同梱して通知
    function 終了(e) {
      if (!ドラッグ中) return;
      const x = parseFloat(ラベル.style.left) || 0;   // layer基準
      const y = parseFloat(ラベル.style.top)  || 0;

      const er = ラベル.getBoundingClientRect();      // 画面基準のラベル矩形
      const area = ドロップ先エリア(doc, e.clientX, e.clientY);

      w.dispatchEvent(new CustomEvent("kanban:drop", {
        detail: {
          id: Number(ラベル.dataset.id || 0),
          x, y,
          elLeft: er.left, elTop: er.top,
          elWidth: er.width, elHeight: er.height,
          area,
          clientX: e.clientX, clientY: e.clientY
        }
      }));
      ドラッグ中 = null;
      ポップ非表示();
    }
    doc.defaultView.addEventListener("pointerup", 終了);
    doc.defaultView.addEventListener("pointercancel", 終了);

    layer.appendChild(ラベル);
    return ラベル;
  }

  w.KanbanLabels = { ラベル作成 };
})(window);
