/* ===== 開始: kanban-frame-single.js（デバッグ版：詳細ログ＋1行内訳＋所属ごと集計＋表示文言調整＋ラベル見た目上書き） ===== */
/*
  日本語コメント（目的）：
  ・上段帯 左セルを「所属名：◯◯　総数：n件　（PC台数: x件 / 職員数: y件 / その他: z件）」の1行で表示します。
  ・3テーブルとも “所属ごと” に集計します（45208:ClassO / 45173:ClassA / 121624:ClassB）。
  ・_recordsCache が後から埋まるケースに備え、件数変化を監視して自動再描画します（最小侵襲）。
  ・表示は1行固定（CSSはnowrapのまま）。長い場合はtitle（ホバー）で全文確認可能。
  ・ラベル見た目は CSS 上書き + 必要時にテキストの「・」「×」をクリーニング（他JSは未変更）。
  ・詳細なデバッグログ（console.group/console.table/console.time）を出力します。
  ・window.KanbanFrameSingleDebug = true でログをより詳細にできます。
*/
(function (w) {
  "use strict";

  /* ========================= デバッグユーティリティ ========================= */

  // 日本語コメント：デバッグフラグ（Kanban設定.デバッグ.有効 または window.KanbanFrameSingleDebug）
  function デバッグ有効判定() {
    try {
      const s = w.Kanban設定 || {};
      if (s?.デバッグ?.有効 === true) return true;
      if (typeof w.KanbanFrameSingleDebug === "boolean") return w.KanbanFrameSingleDebug;
      return true; // 既定でtrue：障害特定のため
    } catch {
      return true;
    }
  }

  // 日本語コメント：安全ログ
  function dbg(...args) {
    if (!デバッグ有効判定()) return;
    try { console.log("[KanbanFrameSingle]", ...args); } catch {}
  }
  function warn(...args) {
    try { console.warn("[KanbanFrameSingle:WARN]", ...args); } catch {}
  }
  function err(...args) {
    try { console.error("[KanbanFrameSingle:ERROR]", ...args); } catch {}
  }

  /* ========================= ユーティリティ ========================= */

  // 日本語コメント：px値を安全に数値化（未設定時は既定値）
  function px数値(v, 既定 = 0) {
    if (v == null) return 既定;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 既定;
  }

  // 日本語コメント：ClassO を安全に取得（後方互換）
  function 安全にClassO(rec) {
    let ch = rec && rec.ClassHash;
    if (typeof ch === "string") {
      try { ch = JSON.parse(ch); }
      catch (e) { dbg("ClassHashのJSONパース失敗:", e, "rec=", rec); ch = {}; }
    }
    const co = (ch && ch.ClassO) || rec?.ClassO || "";
    return co;
  }

  // 日本語コメント：「その他」除外用の候補名セット（ClassOベース）
  function 画像候補名セット() {
    const s = w.Kanban設定 || {};
    const set = new Set((s.画像候補 || []).map(x => x?.名前).filter(Boolean));
    set.delete("その他");
    return set;
  }

  // 日本語コメント：左側（選択画像名＝所属名）のPC台数（台帳：45208）をカウント
  function 左側件数を数える(name) {
    console.groupCollapsed?.("左側件数を数える(PC台数/45208)", { name });
    try {
      const s = w.Kanban設定 || {};
      const 固定右名 = (s?.固定右フレーム?.画像名) || "サーバー室";
      const set = 画像候補名セット();
      const recs = Array.isArray(w._recordsCache) ? w._recordsCache : [];
      if (!Array.isArray(recs)) warn("_recordsCache が配列ではありません:", w._recordsCache);

      let cnt = 0;
      if (name === "その他") {
        for (const r of recs) {
          if (r?._tableId !== 45208) continue;
          const cb = String(安全にClassO(r));
          if (cb !== 固定右名 && !set.has(cb)) cnt++;
        }
      } else {
        for (const r of recs) {
          if (r?._tableId !== 45208) continue;
          if (String(安全にClassO(r)) === String(name)) cnt++;
        }
      }
      dbg("PC台数カウント結果:", { name, cnt, 固定右名, 候補除外: [...set] });
      console.groupEnd?.();
      return cnt;
    } catch (e) {
      err("左側件数を数える で例外:", e);
      console.groupEnd?.();
      return 0;
    }
  }

  // 日本語コメント：右側（固定：サーバー室）のPC台数（台帳：45208）をカウント
  function 右側件数を数える() {
    console.groupCollapsed?.("右側件数を数える(固定右/PC台数)");
    try {
      const s = w.Kanban設定 || {};
      const 固定右名 = (s?.固定右フレーム?.画像名) || "サーバー室";
      const recs = Array.isArray(w._recordsCache) ? w._recordsCache : [];
      let cnt = 0;
      for (const r of recs) {
        if (r?._tableId !== 45208) continue;
        if (String(安全にClassO(r)) === String(固定右名)) cnt++;
      }
      dbg("右側カウント結果:", { 固定右名, cnt, records: Array.isArray(recs) ? recs.length : "N/A" });
      console.groupEnd?.();
      return cnt;
    } catch (e) {
      err("右側件数を数える で例外:", e);
      console.groupEnd?.();
      return 0;
    }
  }

  /* ========================= 追加ユーティリティ（所属名の正規取得） ========================= */
  // 日本語コメント：テーブルごとの所属キーで所属名を取得（ClassHash優先／なければ直下）
  // 45208: ClassO / 45173: ClassA / 121624: ClassB
  function 所属名_正規(rec) {
    const map = { 45208: "ClassO", 45173: "ClassA", 121624: "ClassB" };
    const tid = rec?._tableId;
    const key = map[tid] || "ClassO";

    // ClassHash を安全取得
    let ch = rec && rec.ClassHash;
    if (typeof ch === "string") { try { ch = JSON.parse(ch); } catch { ch = {}; } }
    if (!ch || typeof ch !== "object") ch = {};

    const raw = (ch[key] != null ? ch[key]
                : rec && rec[key] != null ? rec[key]
                : rec && rec.ClassO != null ? rec.ClassO
                : "");
    try { return String(raw).normalize("NFKC").trim(); } catch { return String(raw ?? "").trim(); }
  }

  /* ========================= 内訳（所属ごと） ========================= */

  // 日本語コメント：所属ごとの内訳カウントを返す（常に3区分を返却）
  function テーブル別内訳カウント(左名) {
    console.groupCollapsed?.("テーブル別内訳カウント(所属ごと)", { 左名 });
    const s = w.Kanban設定 || {};
    const 固定右名 = (s?.固定右フレーム?.画像名) || "サーバー室";
    const 候補名セット = new Set((s.画像候補 || []).map(x => x?.名前).filter(Boolean));
    候補名セット.delete("その他");

    const recs = Array.isArray(w._recordsCache) ? w._recordsCache : [];

    // 日本語コメント：左名マッチ関数（所属名_正規 を使う）
    const 左名一致 = (rec) => {
      const belong = 所属名_正規(rec);
      if (左名 === "その他") {
        // 固定右でも候補名セットでもない所属だけを「その他」とみなす
        return (belong !== 固定右名) && !候補名セット.has(belong);
      }
      return belong === 左名;
    };

    let 台帳件数 = 0;     // 45208
    let 職員数件数 = 0;   // 45173
    let その他件数 = 0;   // 121624

    for (const r of recs) {
      const tid = r?._tableId;
      if (!左名一致(r)) continue;
      if (tid === 45208) 台帳件数++;
      else if (tid === 45173) 職員数件数++;
      else if (tid === 121624) その他件数++;
    }

    dbg("内訳カウント結果", { 台帳件数, 職員数件数, その他件数 });
    console.groupEnd?.();
    return { 台帳件数, 職員数件数, その他件数 };
  }

  // 日本語コメント：内訳を1行の表示文字列に整形（ゼロも表示）
  function テーブル別内訳文字列_fromCounts(c) {
    return `（PC台数: ${c.台帳件数}件 / 職員数: ${c.職員数件数}件 / その他: ${c.その他件数}件）`;
  }

  /* ========================= ラベル見た目：CSS上書き＆記号クリーナ ========================= */

  // 日本語コメント：指定ドキュメントにラベル見た目の上書きCSSを注入（!important で確実に上書き）

function ラベル見た目スタイルを注入(targetDoc) {
  try {
    if (!targetDoc || !targetDoc.head) return;
    const id = "kfs-label-override-css";
    if (targetDoc.getElementById(id)) return; // 二重注入防止
    const st = targetDoc.createElement("style");
    st.id = id;
    st.textContent = `
      /* このKanbanのラベルだけを対象（#layer 直下 or .ラベルレイヤ 配下） */
      #layer .ラベル, .ラベルレイヤ .ラベル{
        font-size:13px !important;        /* ★ 12px の 1.5倍 */
        line-height:0.5 !important;
        padding:2px 2px !important;      /* ★ 4px 8px の 1.5倍 */
        gap:1px !important;               /* ★ 4px の 1.5倍 */
        border-radius:999px !important;
      }

      /* 先頭の点（・, 丸要素, 疑似要素）を非表示 */
      #layer .ラベル .丸,
      .ラベルレイヤ .ラベル .丸{
        display:none !important;
      }
      #layer .ラベル::before,
      .ラベルレイヤ .ラベル::before{
        content:none !important;
      }

      /* 末尾のバツ（×, 削除ボタン, 疑似要素）を非表示 */
      #layer .ラベル .削除,
      .ラベルレイヤ .ラベル .削除,
      #layer .ラベル [data-role="delete"],
      .ラベルレイヤ .ラベル [data-role="delete"],
      #layer .ラベル .delete,
      .ラベルレイヤ .ラベル .delete,
      #layer .ラベル button[aria-label="削除"],
      .ラベルレイヤ .ラベル button[aria-label="削除"],
      #layer .ラベル button:last-child,
      .ラベルレイヤ .ラベル button:last-child{
        display:none !important;
      }
      #layer .ラベル::after,
      .ラベルレイヤ .ラベル::after{
        content:none !important;
      }

      /* 子要素も同スケールに（念のため継承） */
      #layer .ラベル * , .ラベルレイヤ .ラベル * {
        font-size:inherit !important;
      }
    `;
    targetDoc.head.appendChild(st);
  } catch (e) {
    console.warn("[KanbanFrameSingle] ラベル見た目スタイルを注入 で例外:", e);
  }
}

  // 日本語コメント：ラベルのテキスト先頭/末尾の「・」「×」など文字を除去（CSSで消せない素の文字対策）
  function ラベル記号クリーナを起動(targetDoc) {
    try {
      const layer = targetDoc.getElementById("layer") || targetDoc.querySelector(".ラベルレイヤ");
      if (!layer) return;

      const クリーニング = (root) => {
        const nodes = root.querySelectorAll(".ラベル");
        nodes.forEach(el => {
          const trimHead = (s) => s.replace(/^[\s　]*(?:・|･|•|●|○|◆|◇)+[\s　]*/u, "");
          const trimTail = (s) => s.replace(/[\s　]*(?:×|✕|✖)+[\s　]*$/u, "");
          // 先頭テキストノード
          let n = el.firstChild;
          if (n && n.nodeType === 3 && n.nodeValue) n.nodeValue = trimHead(n.nodeValue);
          // 末尾テキストノード
          n = el.lastChild;
          if (n && n.nodeType === 3 && n.nodeValue) n.nodeValue = trimTail(n.nodeValue);
        });
      };

      // 初回
      クリーニング(layer);

      // 追加・変更を監視して都度クリーニング
      const mo = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === "childList") {
            m.addedNodes.forEach(nd => {
              if (nd.nodeType === 1) クリーニング(nd);
            });
          } else if (m.type === "characterData") {
            const p = m.target && m.target.parentElement;
            if (p && p.classList && p.classList.contains("ラベル")) クリーニング(p);
          }
        }
      });
      mo.observe(layer, { childList: true, characterData: true, subtree: true });
    } catch (e) {
      console.warn("[KanbanFrameSingle] ラベル記号クリーナ起動 で例外:", e);
    }
  }

  /* ========================= 上段帯（外側）の生成＆更新 ========================= */

  // 日本語コメント：上段帯DOMを作成（親ドキュメント側・iframeの“外”）
  function 上段divを追加(s) {
    console.group?.("上段divを追加");
    console.time?.("上段div作成時間");

    const 枠Top  = px数値(s?.枠?.top,   10);
    const 余白px = px数値(s?.上段帯?.上余白px, 6);
    const 高さpx = px数値(s?.上段帯?.高さpx, 36);
    const 計算Top = Math.max(0, 枠Top - 高さpx - 余白px);

    const 左幅文字列 = (s?.上段帯?.左幅 || "70%");
    const 右幅文字列 = (s?.上段帯?.右幅 || "1fr");

    const 境界微調整px = px数値(s?.上段帯?.境界微調整px, 0);
    const 左列幅 = 境界微調整px === 0
      ? 左幅文字列
      : `calc(${左幅文字列} ${境界微調整px >= 0 ? "+" : "-"} ${Math.abs(境界微調整px)}px)`;

    const 線色 = (s?.上段帯?.線色 || "#bbb");
    const 線太さ = (s?.上段帯?.線太さ || 1);
    const 文字色 = (s?.上段帯?.文字色 || "#333");
    const 背景色 = (s?.上段帯?.背景色 || "#fff");

    dbg("上段帯パラメータ", { 枠Top, 余白px, 高さpx, 計算Top, 左列幅, 右幅文字列, 線色, 線太さ, 文字色, 背景色 });

    const 上段 = document.createElement("div");
    Object.assign(上段.style, {
      position: "absolute",
      top:  `${計算Top}px`,
      left: s?.枠?.left || "10px",
      width: s?.枠?.width || "800px",
      height: `${高さpx}px`,
      display: "grid",
      gridTemplateColumns: `${左列幅} ${右幅文字列}`,
      alignItems: "center",
      gap: "0",
      color: 文字色,
      background: 背景色,
      zIndex: 10000,
      border: "1px solid " + 線色,
      borderRadius: "6px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "0 8px"
    });

    const 左 = document.createElement("div");
    Object.assign(左.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "100%",
      paddingRight: "8px",
      whiteSpace: "nowrap",   // 1行固定
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderRight: `${線太さ}px solid ${線色}`
    });
    左.id = "kanban-上段帯-左";
    上段.appendChild(左);

    const 右 = document.createElement("div");
    Object.assign(右.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "100%",
      paddingLeft: "8px",
      whiteSpace: "nowrap",   // 1行固定
      overflow: "hidden",
      textOverflow: "ellipsis"
    });
    右.id = "kanban-上段帯-右";
    上段.appendChild(右);

    if (!document.body) warn("document.body が未準備の可能性");
    document.body.appendChild(上段);

    console.timeEnd?.("上段div作成時間");
    console.groupEnd?.();
    return 上段;
  }

  // 日本語コメント：上段帯の文言を更新（左/右を個別に更新）
  function 上段帯を更新(上段El, s, 明示左名) {
    console.groupCollapsed?.("上段帯を更新");
    if (!上段El) { warn("上段El がありません"); console.groupEnd?.(); return; }

    const 固定右名 = (s?.固定右フレーム?.画像名) || "サーバー室";
    let 左名 =
      (typeof 明示左名 === "string" && 明示左名) ||
      (w.Kanban現在 && w.Kanban現在.左画像名) ||
      (s?.初期抽出?.値) || "";

    // 左でサーバー室は使わない
    if (左名 === 固定右名) {
      const first = (s?.画像候補 || []).find(x => (x.名前 || "") !== 固定右名 && (x.名前 || "") !== "その他");
      左名 = (first && first.名前) || "その他";
      dbg("左名が固定右と同一のため置換:", { 左名 });
    }
    if (!左名) 左名 = "その他";

    // 内訳を所属ごとに集計
    const counts = テーブル別内訳カウント(左名);
    const 総数 = counts.台帳件数 + counts.職員数件数 + counts.その他件数;

    // 右側は固定右のPC台数
    let 右件 = 0;
    try { 右件 = 右側件数を数える(); } catch (e) { err("右件数計算エラー:", e); }

    // 表示用テキスト
    const 内訳文字列 = テーブル別内訳文字列_fromCounts(counts);

    const 左El = document.getElementById("kanban-上段帯-左");
    const 右El = document.getElementById("kanban-上段帯-右");
    if (左El) {
      // ★ 表示仕様：所属名：◯◯　総数：n件　（PC台数: x件 / 職員数: y件 / その他: z件）
      const leftText = `所属名：${左名}　総数：${総数}件　 ${内訳文字列}`;
      左El.textContent = leftText;
      左El.title = leftText; // ホバーで全文表示
    } else {
      warn("左El が見つかりません");
    }
    if (右El) {
      const rightText = `右(${固定右名}) PC台数: ${右件}件`;
      右El.textContent = rightText;
      右El.title = rightText; // ホバーで全文表示
    } else {
      warn("右El が見つかりません");
    }

    dbg("上段帯更新結果", { 左名, 総数, counts, 固定右名, 右件 });
    console.groupEnd?.();
  }

  /* ========================= 本体：フレーム生成 ========================= */

  function 初期化() {
    console.group?.("初期化");
    console.time?.("初期化所要時間");
    const s = w.Kanban設定 || {};
    if (!w.Kanban設定) warn("Kanban設定 が未定義です（既定で進行）");
    else dbg("Kanban設定 読み込み", JSON.parse(JSON.stringify(s)));

    // ★ 親ページ側に上段divを先に追加（iframe外）
    const 上段El = 上段divを追加(s);

    // 親ドキュメント側にも念のため見た目上書きを注入（#layer/.ラベルレイヤ が存在する場合のみ影響）
    try {
      ラベル見た目スタイルを注入(document);
      ラベル記号クリーナを起動(document);
    } catch {}

    // 初期表示（キャッシュがまだ無くても暫定表示）
    上段帯を更新(上段El, s);

    // 親ページ側の外枠
    const 枠 = document.createElement("div");
    Object.assign(枠.style, {
      position: "absolute",
      top:  s?.枠?.top,
      left: s?.枠?.left,
      width: s?.枠?.width,
      height:s?.枠?.height,
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "8px",
      zIndex: 9999
    });

    // iframe本体
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "0",
      borderRadius: "8px"
    });
    枠.appendChild(iframe);
    document.body.appendChild(枠);

    iframe.addEventListener("load", () => {
      console.groupCollapsed?.("iframe load ハンドラ");
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) { err("iframe.contentWindow.document を取得できません"); console.groupEnd?.(); return; }

        // スタイル（基礎スタイルのみ：ここでは“見た目上書き”を入れず、別styleで注入）
        const css = `
          html,body{height:100%;margin:0;overflow:hidden;}
          .包む{position:relative;height:100%;display:grid;grid-template-columns:7fr 3fr;background:#fff;}
          .パネル{position:relative;overflow:hidden;background:#fff;}
          .右パネル{border-left:1px solid #ddd;}
          img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;}
          .ラベルレイヤ{position:absolute;inset:0;pointer-events:none;}
          .ラベル{position:absolute;display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,0.95);box-shadow:0 1px 4px rgba(0,0,0,0.15);border:1px solid rgba(0,0,0,0.08);font-size:12px;line-height:1.2;color:#333;pointer-events:auto;user-select:none;}
          .ラベル:active{cursor:grabbing;}
          .丸{width:6px;height:6px;border-radius:50%;background:#888;}
          .削除{border:none;background:transparent;color:#777;cursor:pointer;font-size:12px;padding:0 3px;}
          .削除:hover{color:#d33;}
          .座標ポップ{position:absolute;padding:3px 6px;font:12px/1.2 sans-serif;background:#fff;border:1px solid #ddd;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.1);transform:translate(-50%,-120%);white-space:nowrap;z-index:10;}
        `;
        const style = doc.createElement("style");
        style.textContent = css;
        doc.head.appendChild(style);

        // ★ ラベル見た目の“上書きCSS”と“記号クリーナ”を iframe 側にも適用
        ラベル見た目スタイルを注入(doc);
        ラベル記号クリーナを起動(doc);

        // レイアウト（左右2パネル）
        const 包む = doc.createElement("div"); 包む.className = "包む"; doc.body.appendChild(包む);
        const 左パネル = doc.createElement("div"); 左パネル.id = "左パネル"; 左パネル.className = "パネル 左パネル"; 包む.appendChild(左パネル);
        const 右パネル = doc.createElement("div"); 右パネル.id = "右パネル"; 右パネル.className = "パネル 右パネル"; 包む.appendChild(右パネル);

        // 左画像
        const 左画像 = doc.createElement("img"); 左画像.id = "左画像"; 左パネル.appendChild(左画像);

        // 右画像（固定候補）
        const 固定名 = (s?.固定右フレーム?.画像名) || "サーバー室";
        const 右URL = (s?.固定右フレーム?.画像URL)
          || (function 候補からURL() {
               const k = (s?.画像候補 || []).find(x => x?.名前 === 固定名);
               return k?.URL || s?.既定画像URL || "";
             })()
          || (s?.既定画像URL || "");
        const 右画像 = doc.createElement("img"); 右画像.id = "右画像"; 右画像.alt = 固定名; 右画像.src = 右URL; 右パネル.appendChild(右画像);

        dbg("右画像URL決定", { 固定名, 右URL, 候補: s?.画像候補 });

        // 共通ラベルレイヤ
        const レイヤ = doc.createElement("div"); レイヤ.className = "ラベルレイヤ"; レイヤ.id = "layer"; 包む.appendChild(レイヤ);

        // 共有コンテキスト
        w.KanbanFrameSingle = w.KanbanFrameSingle || {};
        w.KanbanFrameSingle._ctx = { iframe, doc, 包む, レイヤ, 左パネル, 右パネル, 左画像, 右画像 };
        dbg("共有コンテキスト設定済み（_ctx）");

      } catch (e) {
        err("iframe load 中に例外:", e);
      } finally {
        console.groupEnd?.();
      }
    });

    // 日本語コメント：iframeのsrcセット（about:blank でOK）
    iframe.src = "about:blank";

    // レコード到着を監視して上段帯を自動再描画
    _records監視を開始(上段El, s);

    // 日本語コメント：イベントに反応して上段帯を再計算（もし発火される実装であれば）
    try {
      w.addEventListener("kanban:imageSelected", (ev) => {
        dbg("イベント受信: kanban:imageSelected", ev?.detail);
        上段帯を更新(document.getElementById("kanban-上段帯-左")?.parentElement, s, ev?.detail?.name);
      });
      w.addEventListener("kanban:drop", (ev) => {
        dbg("イベント受信: kanban:drop", ev?.detail);
        上段帯を更新(document.getElementById("kanban-上段帯-左")?.parentElement, s);
      });
    } catch (e) {
      warn("カスタムイベント登録に失敗:", e);
    }

    // 日本語コメント：データの現況をざっくり出力
    try {
      const recs = Array.isArray(w._recordsCache) ? w._recordsCache : [];
      dbg("_recordsCache 現況", { 件数: Array.isArray(recs) ? recs.length : "N/A", サンプル: recs?.[0] });
      if (!Array.isArray(recs) || recs.length === 0) {
        warn("_recordsCache が空、または未設定の可能性（件数が0）。数字は0になります。");
      }
    } catch (e) {
      warn("_recordsCache 確認中に例外:", e);
    }

    console.timeEnd?.("初期化所要時間");
    console.groupEnd?.();
    return { iframe };
  }

  /* ========================= _recordsCache 監視 ========================= */

  // 日本語コメント：_recordsCache の件数変化を監視し、変化時に上段帯を再描画（最小侵襲）
  function _records監視を開始(上段El, s) {
    try {
      if (w.__KFS監視Timer) return; // 多重起動防止

      let 直前件数 = (Array.isArray(w._recordsCache) ? w._recordsCache.length : 0);
      let カウント = 0;

      w.__KFS監視Timer = setInterval(() => {
        const recs = Array.isArray(w._recordsCache) ? w._recordsCache : [];
        const 現在件数 = recs.length;

        if (現在件数 !== 直前件数) {
          try {
            console.log("[KanbanFrameSingle] _recordsCache 変化検知:", 直前件数, "→", 現在件数);
            上段帯を更新(上段El, s);
          } catch (e) {
            console.warn("[KanbanFrameSingle] 上段帯更新で例外:", e);
          }
          直前件数 = 現在件数;
        }

        // 初期ロード遅延や再検索にある程度対応（最大1分＝120回）
        カウント++;
        if (カウント >= 120) {
          clearInterval(w.__KFS監視Timer);
          w.__KFS監視Timer = null;
        }
      }, 500);
    } catch (e) {
      console.warn("[KanbanFrameSingle] _records監視開始 で例外:", e);
    }
  }

  /* ========================= 公開 ========================= */

  w.KanbanFrameSingle = { 初期化, _ctx: null };
  dbg("スクリプト読込完了。初期化は KanbanFrameSingle.初期化() を呼び出してください。");
})(window);

/* ===== 終了: kanban-frame-single.js ===== */
