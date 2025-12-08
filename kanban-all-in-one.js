(function(window) {
  "use strict";

/* ===============================================================
 * 1. KANBAN-CONFIG.JS
 * システム設定
 * ============================================================= */
(function (w) {
  "use strict";

  // ★ デバッグログ制御フラグ（問題特定時に不要なログを抑制）
  const DEBUG_VERBOSE = false; // false: 最小限のログのみ, true: 全ログ出力

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
    // ★ OS表示倍率対応：基準サイズ（OS表示倍率100%での表示サイズ）
    // 実際のiframeサイズは、DPR（デバイスピクセル比）で自動調整される
    // 例：OS表示倍率125%（DPR=1.25）の場合、width: 950/1.25=760px で設定され、表示サイズは950pxになる
    枠: {
      top: "100px",
      left: "700px",
      baseWidth: 950,   // 基準幅（OS表示倍率100%での表示サイズ）
      baseHeight: 700   // 基準高さ（OS表示倍率100%での表示サイズ）
    },

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
    // ★初期表示は空（メニュークリックまで何も表示しない）
    初期抽出: { 対象フィールド: "ClassO", 値: null },

    /* ===== 右側は"サーバー室"に固定 ===== */
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

  // ★ デバッグフラグをグローバルに公開
  w.DEBUG_VERBOSE = DEBUG_VERBOSE;
})(window);

if (window.DEBUG_VERBOSE) console.log("✓ Kanban設定 初期化完了");

/* ===============================================================
 * 2. KANBAN-FRAME-SINGLE.JS
 * UIフレーム生成
 * ============================================================= */
(function (w) {
  "use strict";

  /* ========================= デバッグユーティリティ ========================= */

  // 日本語コメント：デバッグフラグ（Kanban設定.デバッグ.有効 または window.KanbanFrameSingleDebug または window.DEBUG_VERBOSE）
  function デバッグ有効判定() {
    try {
      const s = w.Kanban設定 || {};
      if (s?.デバッグ?.有効 === true) return true;
      if (typeof w.KanbanFrameSingleDebug === "boolean") return w.KanbanFrameSingleDebug;
      if (typeof w.DEBUG_VERBOSE === "boolean") return w.DEBUG_VERBOSE;
      return false; // 既定でfalse：問題特定時はログを最小限に
    } catch {
      return false;
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
    if (window.DEBUG_VERBOSE) console.groupCollapsed?.("左側件数を数える(PC台数/45208)", { name });
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
      if (window.DEBUG_VERBOSE) console.groupEnd?.();
      return cnt;
    } catch (e) {
      err("左側件数を数える で例外:", e);
      if (window.DEBUG_VERBOSE) console.groupEnd?.();
      return 0;
    }
  }

  // 日本語コメント：右側（固定：サーバー室）のPC台数（台帳：45208）をカウント
  function 右側件数を数える() {
    if (window.DEBUG_VERBOSE) console.groupCollapsed?.("右側件数を数える(固定右/PC台数)");
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
      if (window.DEBUG_VERBOSE) console.groupEnd?.();
      return cnt;
    } catch (e) {
      err("右側件数を数える で例外:", e);
      if (window.DEBUG_VERBOSE) console.groupEnd?.();
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
    if (window.DEBUG_VERBOSE) console.groupCollapsed?.("テーブル別内訳カウント(所属ごと)", { 左名 });
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
    if (window.DEBUG_VERBOSE) console.groupEnd?.();
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

  // 日本語コメント：上段帯DOMを作成（親ドキュメント側・iframeの"外"）
  function 上段divを追加(s, container) {
    console.group?.("上段divを追加");
    console.time?.("上段div作成時間");

    const 枠Top  = px数値(s?.枠?.top,   10);
    const 余白px = px数値(s?.上段帯?.上余白px, 0);
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

    // ★ OS表示倍率対応：青枠と同じスケール処理を適用
    const dpr = window.devicePixelRatio || 1;
    const scale = 1 / dpr;

    // ★ 黄色枠を基準（0px）に設定
    const 枠Left = parseInt(String(s?.枠?.left || "700"), 10);
    const 相対Left = container ? 枠Left - 500 : 枠Left;
    const 相対Top = container ? 3 : 計算Top;  // コンテナ内では常に 3px（緑枠より3px下）

    dbg("上段帯パラメータ", { 枠Top, 余白px, 高さpx, 計算Top, 相対Top, 相対Left, 左列幅, 右幅文字列, 線色, 線太さ, 文字色, 背景色, dpr, scale });

    const 上段 = document.createElement("div");
    Object.assign(上段.style, {
      position: "absolute",
      top:  `${相対Top}px`,
      left: `${相対Left}px`,
      width: (s?.枠?.baseWidth || s?.枠?.width || 950) + "px",
      height: `${高さpx}px`,
      display: "grid",
      gridTemplateColumns: `${左列幅} ${右幅文字列}`,
      alignItems: "center",
      gap: "0",
      color: 文字色,
      background: 背景色,
      zIndex: 10000,
      border: "3px solid yellow",
      borderRadius: "6px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "0 8px",
      // ★ DPR > 1の場合、transform: scaleで縮小（青枠と同じ）
      transform: dpr > 1 ? `scale(${scale})` : "none",
      transformOrigin: "top left"
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

    if (!container && !document.body) warn("container も document.body も未準備の可能性");
    (container || document.body).appendChild(上段);

    console.timeEnd?.("上段div作成時間");
    if (window.DEBUG_VERBOSE) console.groupEnd?.();
    return 上段;
  }

  // 日本語コメント：上段帯の文言を更新（左/右を個別に更新）
  function 上段帯を更新(上段El, s, 明示左名) {
    if (w.DEBUG_VERBOSE) if (window.DEBUG_VERBOSE) console.groupCollapsed?.("上段帯を更新");
    if (!上段El) { warn("上段El がありません"); if (w.DEBUG_VERBOSE) if (window.DEBUG_VERBOSE) console.groupEnd?.(); return; }

    const 固定右名 = (s?.固定右フレーム?.画像名) || "サーバー室";
    let 左名 =
      (typeof 明示左名 === "string" && 明示左名) ||
      (w.Kanban現在 && w.Kanban現在.左画像名) ||
      (s?.初期抽出?.値);

    // 初期値がnullの場合の処理
    if (左名 === null || 左名 === undefined) {
      const 左El = document.getElementById("kanban-上段帯-左");
      if (左El) {
        const leftText = "所属名：未選択（左メニューから選択してください）";
        左El.textContent = leftText;
        左El.title = leftText;
      }

      // 右側は表示
      let 右件 = 0;
      try { 右件 = 右側件数を数える(); } catch (e) { err("右件数計算エラー:", e); }
      const 右El = document.getElementById("kanban-上段帯-右");
      if (右El) {
        const rightText = `右(${固定右名}) PC台数: ${右件}件`;
        右El.textContent = rightText;
        右El.title = rightText;
      }

      dbg("上段帯更新結果", { 左名: "未選択", 固定右名, 右件 });
      if (window.DEBUG_VERBOSE) console.groupEnd?.();
      return;
    }

    // 左名が空文字列の場合は「その他」にする
    if (!左名) 左名 = "その他";

    // 左でサーバー室は使わない
    if (左名 === 固定右名) {
      const first = (s?.画像候補 || []).find(x => (x.名前 || "") !== 固定右名 && (x.名前 || "") !== "その他");
      左名 = (first && first.名前) || "その他";
      dbg("左名が固定右と同一のため置換:", { 左名 });
    }

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
    if (window.DEBUG_VERBOSE) console.groupEnd?.();
  }

  /* ========================= 本体：フレーム生成 ========================= */

  function 初期化(container) {
    console.group?.("初期化");
    if (window.DEBUG_VERBOSE) console.time?.("初期化所要時間");
    const s = w.Kanban設定 || {};
    if (!w.Kanban設定) warn("Kanban設定 が未定義です（既定で進行）");
    else dbg("Kanban設定 読み込み", JSON.parse(JSON.stringify(s)));

    // ★ 親ページ側に上段divを先に追加（iframe外）
    const 上段El = 上段divを追加(s, container);

    // 親ドキュメント側にも念のため見た目上書きを注入（#layer/.ラベルレイヤ が存在する場合のみ影響）
    try {
      ラベル見た目スタイルを注入(document);
      ラベル記号クリーナを起動(document);
    } catch {}

    // 初期表示（キャッシュがまだ無くても暫定表示）
    上段帯を更新(上段El, s);

    // ★ OS表示倍率対応：CSS Transform Scaleで実装
    // iframe内部の座標系を常に固定（950x700）し、表示時にスケーリング
    const dpr = window.devicePixelRatio || 1;
    const baseWidth = s?.枠?.baseWidth || s?.枠?.width || 950;
    const baseHeight = s?.枠?.baseHeight || s?.枠?.height || 700;

    // スケール係数を計算（OS表示倍率125%なら0.8）
    const scale = 1 / dpr;

    // ★ コンテナ内の相対座標に変換（コンテナ基準: left 500px, top 64px）
    const コンテナ基準Left = 500;
    const コンテナ基準Top = 64;
    const 枠Left = parseInt(String(s?.枠?.left || "700"), 10);
    const 枠Top = parseInt(String(s?.枠?.top || "100"), 10);
    const 相対Left = container ? 枠Left - コンテナ基準Left : 枠Left;
    const 相対Top = container ? 枠Top - コンテナ基準Top : 枠Top;

    console.log(`[iframe枠] DPR=${dpr.toFixed(2)}, 基準サイズ=${baseWidth}x${baseHeight}, スケール=${scale.toFixed(3)}, 相対座標=(${相対Left}, ${相対Top})`);

    // 親ページ側の外枠
    const 枠 = document.createElement("div");
    Object.assign(枠.style, {
      position: "absolute",
      top:  `${相対Top}px`,
      left: `${相対Left}px`,
      width: baseWidth + "px",        // 常に基準サイズ
      height: baseHeight + "px",      // 常に基準サイズ
      background: "#fff",
      border: "3px solid blue",
      borderRadius: "8px",
      zIndex: 9999,
      // ★ DPR > 1の場合、transform: scaleで縮小
      transform: dpr > 1 ? `scale(${scale})` : "none",
      transformOrigin: "top left"     // 左上を基準に縮小
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
    (container || document.body).appendChild(枠);

    iframe.addEventListener("load", () => {
      if (window.DEBUG_VERBOSE) console.groupCollapsed?.("iframe load ハンドラ");
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) { err("iframe.contentWindow.document を取得できません"); if (window.DEBUG_VERBOSE) console.groupEnd?.(); return; }

        // スタイル（基礎スタイルのみ：ここでは"見た目上書き"を入れず、別styleで注入）
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

        // ★ ラベル見た目の"上書きCSS"と"記号クリーナ"を iframe 側にも適用
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

        // ★ OS表示倍率対応：レイアウト確定を待つ
        // iframeのload直後はグリッドレイアウトが確定していない可能性があるため、
        // requestAnimationFrameで2フレーム待つことでレイアウト確定を保証する
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const 右Rect = 右パネル.getBoundingClientRect();
            const 左Rect = 左パネル.getBoundingClientRect();
            const 包むRect = 包む.getBoundingClientRect();
            const iframeRect = iframe.getBoundingClientRect();

            console.log(`[iframeレイアウト確定] iframe実サイズ: ${Math.round(iframeRect.width)}x${Math.round(iframeRect.height)}`);
            console.log(`[iframeレイアウト確定] 包むサイズ: ${Math.round(包むRect.width)}x${Math.round(包むRect.height)}`);
            console.log(`[iframeレイアウト確定] 左パネル: ${Math.round(左Rect.width)}x${Math.round(左Rect.height)}, 右パネル: ${Math.round(右Rect.width)}x${Math.round(右Rect.height)}`);

            // コンテナサイズの妥当性チェック
            if (右Rect.width < 100) {
              console.warn(`[iframeレイアウト] 右パネル幅が異常に小さい: ${Math.round(右Rect.width)}px（レイアウト未確定の可能性）`);
            }
          });
        });

      } catch (e) {
        err("iframe load 中に例外:", e);
      } finally {
        if (window.DEBUG_VERBOSE) console.groupEnd?.();
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

    if (window.DEBUG_VERBOSE) console.timeEnd?.("初期化所要時間");
    if (window.DEBUG_VERBOSE) console.groupEnd?.();
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
            if (window.DEBUG_VERBOSE) console.log("[KanbanFrameSingle] _recordsCache 変化検知:", 直前件数, "→", 現在件数);
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

if (window.DEBUG_VERBOSE) console.log("✓ KanbanFrameSingle 初期化完了");

/* ===============================================================
 * 3. KANBAN-LABELS-SINGLE.JS
 * ラベル生成・ドラッグ機能
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

if (window.DEBUG_VERBOSE) console.log("✓ KanbanLabels 初期化完了");

/* ===============================================================
 * 4. PLEASANTER-API.JS
 * テーブル45208 データ取得
 * ============================================================= */
(function (w) {
  "use strict";

  /* ---------- 設定 ---------- */
  const 設定 = {
    url   : "http://gwsv.nanyo-ad.ad.nanyo/api/items/45208/get",
    apiKey: "f2ae46b2fd9669a23313a1230dd3b7ecc094ffc16b0798ae156d940a2be85b5395f44bac9eb20058143500a3c0d56b6c76d4f00acc842a08ff4748ab0beb2f46"
  };

  /* ---------- 応答検証 ---------- */
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
  async function 一ページ取得(offset) {
    const body = {
      ApiVersion: 1.1,
      ApiKey    : 設定.apiKey,
      Offset    : offset,
      View      : { Conditions: [] }
    };

    const res = await fetch(設定.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });

    const r = await 応答確認(res);

    const rows      = Array.isArray(r && r.Data) ? r.Data : [];
    const total     = Number((r && r.TotalCount) != null ? r.TotalCount : 0);
    const pageSize  = Number((r && r.PageSize)   != null ? r.PageSize   : (rows.length || 200));
    const currentOf = Number((r && r.Offset)     != null ? r.Offset     : offset);
    const nextOffset = currentOf + pageSize;

    return { rows: rows, total: total, pageSize: pageSize, currentOf: currentOf, nextOffset: nextOffset };
  }

  /* ---------- 主要API: レコード全件取得 ---------- */
  async function レコード取得() {
    const 収集 = [];
    let offset = 0;

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

      Array.prototype.push.apply(収集, rows);

      console.log(
        "ページ取得(45208): offset=" + currentOf +
        ", pageSize=" + pageSize +
        ", 収集=" + 収集.length + "/" + (total || "?")
      );

      if (total && nextOffset >= total) {
        break;
      }

      offset = nextOffset;
    }
    return 収集;
  }

  /* ---------- 公開 ---------- */
  w.PleasanterApi = { レコード取得: レコード取得 };
  if (window.DEBUG_VERBOSE) console.log("✓ PleasanterApi 初期化完了（テーブル45208）");
})(window);

/* ===============================================================
 * 5. PLEASANTER-API2.JS
 * テーブル45173 データ取得
 * ============================================================= */
(function (w) {
  "use strict";

  /* ---------- 設定 ---------- */
  var 設定 = {
    urlBase: "http://gwsv.nanyo-ad.ad.nanyo/api/items",
    tableId: 45173,
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
      if (window.DEBUG_VERBOSE) console.log("ページ取得(45173): offset=" + ページ.currentOf + ", pageSize=" + ページ.pageSize + ", 収集=" + 収集.length + "/" + (total || "?"));
      if (total && nextOffset >= total) break;
      offset = nextOffset;
    }
    w._recordsCache_45173 = 収集;
    return 収集;
  }

  w.PleasanterApi別 = { レコード取得 };

  if (window.DEBUG_VERBOSE) console.log("✓ PleasanterApi別 初期化完了（テーブル45173）");
})(window);

/* ===============================================================
 * 6. PLEASANTER-API3.JS
 * テーブル121624 データ取得
 * ============================================================= */
(function (w) {
  "use strict";

  /* ---------- 設定 ---------- */
  var 設定 = {
    urlBase: "http://gwsv.nanyo-ad.ad.nanyo/api/items",
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
      if (window.DEBUG_VERBOSE) console.log("ページ取得(121624): offset=" + ページ.currentOf + ", pageSize=" + ページ.pageSize + ", 収集=" + 収集.length + "/" + (total || "?"));
      if (total && nextOffset >= total) break;
      offset = nextOffset;
    }
    w._recordsCache_121624 = 収集;
    return 収集;
  }

  w.PleasanterApi_121624 = { レコード取得 };

  if (window.DEBUG_VERBOSE) console.log("✓ PleasanterApi_121624 初期化完了（テーブル121624）");
})(window);

/* ===============================================================
 * 7. PLEASANTER-UPDATE-API.JS
 * レコード更新API
 * ============================================================= */
(function (w) {
  "use strict";

  /* ---------- 設定（絶対URL） ---------- */
  const 設定 = {
    itemsBaseUrl: "http://gwsv.nanyo-ad.ad.nanyo/api/items",
    apiKey: "f2ae46b2fd9669a23313a1230dd3b7ecc094ffc16b0798ae156d940a2be85b5395f44bac9eb20058143500a3c0d56b6c76d4f00acc842a08ff4748ab0beb2f46"
  };

  /* ---------- 共通ユーティリティ ---------- */
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
  async function レコード更新(id, updates) {
    if (id == null) throw new Error("id が未指定です");

    const url = `${設定.itemsBaseUrl}/${encodeURIComponent(id)}/update`;

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

  if (window.DEBUG_VERBOSE) console.log("✓ PleasanterUpdateApi 初期化完了");
})(window);

/* ===============================================================
 * 8. KANBAN-MENU.JS
 * 画像選択メニュー
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
    el.style.border = "3px solid green";
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

  // 画像メニュー生成関数（タブマネージャー対応）
  async function 画像メニュー生成(container) {
    const s = w.Kanban設定; if (!s) return;

    const 固定名 = s?.固定右フレーム?.画像名 || "サーバー室";

    const menuWidth = Number(s.メニュー幅px || 200);
    const frameLeft = parseInt(String(s.枠.left), 10) || 700;
    const topPx = s.枠.top || "100px";

    const メニュー = document.createElement("div");
    メニュースタイル(メニュー);
    // コンテナ内の相対座標（コンテナ基準: left 500px, top 64px）
    メニュー.style.top = "0px";
    メニュー.style.left = "0px";
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
          if (ctx.左画像) {
            ctx.左画像.src = item.url;
            // 画像ロード完了を待つ
            try {
              await w.画像ロード待機(ctx.左画像);
              console.log("[画像切替] 左画像のロード完了:", item.url);
            } catch (err) {
              console.warn("[画像切替] 左画像のロード失敗:", err.message);
            }
          }
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

    (container || document.body).appendChild(メニュー);

    // 復元（左画像へ適用）
    if (last && last !== s.画像URL) {
      const ctx = await フレーム準備を待つ();
      if (ctx?.左画像) {
        ctx.左画像.src = last;
        // 画像ロード完了を待つ
        try {
          await w.画像ロード待機(ctx.左画像);
          console.log("[画像復元] 左画像のロード完了:", last);
        } catch (err) {
          console.warn("[画像復元] 左画像のロード失敗:", err.message);
        }
      }
    }
  }

  // 公開API
  w.画像メニュー生成 = 画像メニュー生成;
})(window);

if (window.DEBUG_VERBOSE) console.log("✓ KanbanMenu 初期化完了");

/* ===============================================================
 * 9. KANBAN-DROP-SAVE.JS
 * ドラッグ&ドロップ保存
 * ============================================================= */
(function (w) {
  "use strict";

  function 丸(v) { return Math.round(Number(v) || 0); }

  // ===== 座標変換関数（パーセンテージベース） =====

  // ピクセル座標をパーセンテージに変換（保存時）
  function ピクセルからパーセンテージ(pixelX, pixelY, panelWidth, panelHeight) {
    if (!panelWidth || !panelHeight) {
      console.warn("パネルサイズが0です:", { panelWidth, panelHeight });
      return { percentX: 0, percentY: 0 };
    }
    const percentX = (pixelX / panelWidth) * 100;
    const percentY = (pixelY / panelHeight) * 100;

    // パーセンテージを0-100の範囲に制限（ラベルが画像外に配置されるのを防ぐ）
    const clampedX = Math.max(0, Math.min(100, Math.round(percentX)));
    const clampedY = Math.max(0, Math.min(100, Math.round(percentY)));

    // 範囲外の場合は警告
    if (clampedX !== Math.round(percentX) || clampedY !== Math.round(percentY)) {
      console.warn(`[座標変換] パーセンテージが範囲外です: (${Math.round(percentX)}, ${Math.round(percentY)}) → (${clampedX}, ${clampedY}) に制限`);
    }

    return {
      percentX: clampedX,  // 整数値（0-100）サーバーエラー回避
      percentY: clampedY
    };
  }

  // パーセンテージをピクセル座標に変換（表示時）
  function パーセンテージからピクセル(percentX, percentY, panelWidth, panelHeight) {
    const pixelX = (percentX / 100) * panelWidth;
    const pixelY = (percentY / 100) * panelHeight;
    return {
      pixelX: Math.round(pixelX),
      pixelY: Math.round(pixelY)
    };
  }

  // 座標が旧形式（ピクセル）か新形式（パーセンテージ）かを判定
  // ピクセル形式は100より大きい値になるため、それで判別
  function is旧ピクセル形式(x, y) {
    return (x > 100 || y > 100);
  }

  // ★ 他のモジュールから使えるようにグローバルに公開
  w.ピクセルからパーセンテージ = ピクセルからパーセンテージ;
  w.パーセンテージからピクセル = パーセンテージからピクセル;
  w.is旧ピクセル形式 = is旧ピクセル形式;

  // ===== 画像の実際の表示サイズを計算（object-fit: contain対応） =====

  /**
   * object-fit: contain が適用された画像の実際の表示サイズとオフセットを計算
   * @param {HTMLImageElement} img - 画像要素
   * @param {number} containerWidth - コンテナの幅
   * @param {number} containerHeight - コンテナの高さ
   * @returns {{width: number, height: number, offsetX: number, offsetY: number}}
   */
  // 画像ロード完了を待つヘルパー関数
  function 画像ロード待機(img) {
    if (!img) return Promise.reject(new Error("画像要素がnullです"));
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("画像ロードタイムアウト（10秒）"));
      }, 10000);

      img.addEventListener('load', () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });

      img.addEventListener('error', () => {
        clearTimeout(timeout);
        reject(new Error("画像ロードエラー"));
      }, { once: true });
    });
  }

  w.画像ロード待機 = 画像ロード待機;

  function 画像の実表示サイズを取得(img, containerWidth, containerHeight) {
    // より厳密な画像ロードチェック
    if (!img) {
      console.warn("[画像サイズ計算] 画像要素がnullです");
      return { width: containerWidth, height: containerHeight, offsetX: 0, offsetY: 0 };
    }

    if (!img.complete) {
      console.warn("[画像サイズ計算] 画像がまだロードされていません (complete=false)");
      return { width: containerWidth, height: containerHeight, offsetX: 0, offsetY: 0 };
    }

    if (!img.naturalWidth || !img.naturalHeight) {
      console.warn("[画像サイズ計算] 画像のnaturalサイズが取得できません", {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
      return { width: containerWidth, height: containerHeight, offsetX: 0, offsetY: 0 };
    }

    // デバイスピクセル比とコンテナサイズをログ出力
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    console.log(`[画像サイズ計算] DPR=${dpr.toFixed(2)}, natural=${img.naturalWidth}x${img.naturalHeight}, container=${Math.round(containerWidth)}x${Math.round(containerHeight)}`);

    // ゼロ除算対策を追加
    if (containerWidth <= 0 || containerHeight <= 0) {
      console.warn("[画像サイズ計算] コンテナサイズが不正です", { containerWidth, containerHeight });
      return { width: img.naturalWidth, height: img.naturalHeight, offsetX: 0, offsetY: 0 };
    }

    // ★ OS表示倍率125%問題：コンテナサイズが異常に小さい場合の警告
    if (containerWidth < 100) {
      console.error(`[画像サイズ計算] ⚠️ コンテナ幅が異常に小さい: ${Math.round(containerWidth)}px`);
      console.error("[画像サイズ計算] → レイアウト未確定の可能性。座標計算が不正確になります。");
      console.error("[画像サイズ計算] → OS表示倍率が100%以外の場合、この問題が発生しやすくなります。");
    }

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerWidth / containerHeight;

    let displayWidth, displayHeight, offsetX, offsetY;

    if (imgAspect > containerAspect) {
      // 画像が横長 → 幅に合わせる
      displayWidth = containerWidth;
      displayHeight = containerWidth / imgAspect;
      offsetX = 0;
      offsetY = (containerHeight - displayHeight) / 2;
    } else {
      // 画像が縦長 → 高さに合わせる
      displayHeight = containerHeight;
      displayWidth = containerHeight * imgAspect;
      offsetX = (containerWidth - displayWidth) / 2;
      offsetY = 0;
    }

    console.log(`[画像サイズ計算] display=${Math.round(displayWidth)}x${Math.round(displayHeight)}, offset=(${Math.round(offsetX)}, ${Math.round(offsetY)}), aspect=${imgAspect.toFixed(3)} vs ${containerAspect.toFixed(3)}`);

    return {
      width: displayWidth,
      height: displayHeight,
      offsetX: offsetX,
      offsetY: offsetY
    };
  }

  w.画像の実表示サイズを取得 = 画像の実表示サイズを取得;

  // ===== 既存の座標処理関数 =====

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

    const ctx = w.KanbanFrameSingle._ctx;
    const { x: pixelX, y: pixelY } = パネル相対に直す(detail, ctx);
    if (pixelX == null || pixelY == null) { console.warn("保存スキップ: 座標null"); return; }

    // パネルと画像を取得
    const panelEl = (area === "右") ? ctx.右パネル : ctx.左パネル;
    const imgEl = (area === "右") ? ctx.右画像 : ctx.左画像;
    const panelRect = panelEl.getBoundingClientRect();

    // ★ 画像の実際の表示サイズとオフセットを計算（object-fit: contain対応）
    const imgDisplay = 画像の実表示サイズを取得(imgEl, panelRect.width, panelRect.height);

    // ★ パネル相対座標を画像相対座標に変換（オフセットを引く）
    const imgRelativeX = pixelX - imgDisplay.offsetX;
    const imgRelativeY = pixelY - imgDisplay.offsetY;

    // ★ 画像サイズを基準にパーセンテージに変換
    const { percentX, percentY } = ピクセルからパーセンテージ(imgRelativeX, imgRelativeY, imgDisplay.width, imgDisplay.height);

    console.log(`▶ 座標変換: パネル相対(${Math.round(pixelX)}, ${Math.round(pixelY)}) → 画像相対(${Math.round(imgRelativeX)}, ${Math.round(imgRelativeY)}) → パーセンテージ(${percentX}%, ${percentY}%) / 画像表示サイズ(${Math.round(imgDisplay.width)}x${Math.round(imgDisplay.height)})`);

    const updates = 構築_updates(percentX, percentY, area);
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
          // ★ キャッシュにもパーセンテージを保存
          if (S.書込キー直下) { rec[KX] = percentX; rec[KY] = percentY; }
          else {
            let nh = rec.NumHash;
            try { if (typeof nh === "string") nh = JSON.parse(nh || "{}"); } catch { nh = {}; }
            if (!nh || typeof nh !== "object") nh = {};
            nh[KX] = percentX; nh[KY] = percentY; rec.NumHash = nh;
          }
          if (typeof rec.Revision === "number") rec.Revision += 1;
        }
      }
      console.log(`▶ 保存成功 id=${id} (${area}) x=${percentX}%, y=${percentY}%`);
    } catch (e) {
      console.error("▶ 保存失敗:", e && e.message ? e.message : e);
    }
  }

  function バインド() {
    if (w.__kanbanDropSaveBound) return;
    w.__kanbanDropSaveBound = true;

    w.addEventListener("kanban:drop", function (ev) {
      if (window.DEBUG_VERBOSE) console.log("▶ kanban:drop 捕捉 detail=", ev && ev.detail);
      Promise.resolve().then(() => 保存(ev && ev.detail || {}));
    });

    if (window.DEBUG_VERBOSE) console.log("▶ kanban-drop-save.js バインド完了");
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

if (window.DEBUG_VERBOSE) console.log("✓ KanbanDropSave 初期化完了");

/* ===============================================================
 * 10. KANBAN-BOOTSTRAP.JS
 * システム起動・初期化
 * ============================================================= */
(function (w) {
  "use strict";

  /* ========================= 設定 ========================= */
  const DEBUG = false;        // 全体デバッグ
  const DEBUG色 = false;      // 色分け＆ClassHashデバッグ用（問題特定時はfalse）
  const DEBUG色45173J = false; // 45173の ClassJ=会計年度 監視ログ（問題特定時はfalse）

  const 固定右名 = "サーバー室";

  const 所属キー = {
    45208: "ClassO",
    45173: "ClassA",
    121624: "ClassB"
  };

  const ラベルキー = {
    45208: null,
    45173: "ClassC",
    121624: "ClassC"
  };

  /* ========================= ユーティリティ ========================= */

  function 正規化(s) {
    const t = (s == null) ? "" : String(s);
    try { return t.normalize("NFKC").trim(); } catch { return t.trim(); }
  }

  function 取得_ClassHash(rec) {
    let ch = rec && rec.ClassHash;
    if (typeof ch === "string") {
      try { ch = JSON.parse(ch); } catch { ch = {}; }
    }
    if (!ch || typeof ch !== "object") ch = {};
    return ch;
  }

  function 取得_NumHash(rec) {
    let nh = rec && rec.NumHash;
    if (typeof nh === "string") {
      try { nh = JSON.parse(nh); } catch { nh = {}; }
    }
    if (!nh || typeof nh !== "object") nh = {};
    return nh;
  }

  function debugClassHash(prefix, rec) {
    if (!DEBUG) return;
    const tid = rec?._tableId;
    const ch = 取得_ClassHash(rec);
    const keys = Object.keys(ch || {});
    if (window.DEBUG_VERBOSE) console.log(`${prefix} ★debug ClassHash keys: ${tid}`, keys);
  }

  /* ========================= 所属名・ラベル名 ========================= */

  function 所属名(rec) {
    const tid = rec?._tableId;
    const key = 所属キー[tid] || "ClassO";
    const ch  = 取得_ClassHash(rec);

    const raw =
      (ch && ch[key] != null ? ch[key] :
       rec && rec[key] != null ? rec[key] :
       (rec && rec.ClassO != null ? rec.ClassO : ""));

    const val = 正規化(raw);

    if (DEBUG) {
      if (window.DEBUG_VERBOSE) console.log(
        "所属名判定:",
        tid, "→", val, "(key:", key, ", raw:", raw, ", rawType:", typeof raw, ")"
      );
    }
    return val;
  }

  function ラベル表示名(rec, i) {
    const tid = rec?._tableId;
    const key = ラベルキー[tid];
    const ch  = 取得_ClassHash(rec);

    if (key) {
      const raw = ch[key];
      const v   = 正規化(raw);
      if (DEBUG) {
        if (window.DEBUG_VERBOSE) console.log(
          "ラベル表示名(ClassHash):",
          tid, "→", v || `(fallback)`, "(key:", key, ", raw:", raw, ", rawType:", typeof raw, ")"
        );
      }
      if (v) return v;
    }

    const 候補 = [rec?.Title, rec?.ItemTitle, rec?.Name, rec?.Subject, rec?.TitleA, rec?.DescriptionA];
    const t = 候補.find(v => typeof v === "string" && v.trim && v.trim());
    const name = t ? String(t) : `ラベル${(i || 0) + 1}`;

    if (DEBUG && !key) {
      if (window.DEBUG_VERBOSE) console.log("ラベル表示名(従来候補):", tid, "→", name, "(raw: undefined )");
    }
    return name;
  }

  /* ========================= 画像候補名 / 左抽出 ========================= */

  function 画像候補名セット() {
    const s = w.Kanban設定 || {};
    const set = new Set((s.画像候補 || []).map(x => x?.名前).filter(Boolean));
    set.delete("その他");
    return set;
  }

  function 現在の左画像名() {
    const s = w.Kanban設定 || {};
    const 固定名 = (s?.固定右フレーム?.画像名) || 固定右名;

    // Kanban現在に左画像名があればそれを使う（メニュークリック後）
    if (w.Kanban現在 && w.Kanban現在.左画像名) {
      return w.Kanban現在.左画像名;
    }

    // 初期抽出値がnullの場合はnullを返す（初期表示なし）
    const 初期値 = s?.初期抽出?.値;
    if (初期値 === null || 初期値 === undefined) {
      return null;
    }

    // 初期値があれば使う
    let name = 初期値 || "その他";
    if (name === 固定名) {
      const first = (s.画像候補 || []).find(x => (x.名前 || "") !== 固定名 && (x.名前 || "") !== "その他");
      name = first?.名前 || "その他";
    }
    if (!name) name = "その他";
    return name;
  }

  function 左側の抽出(records, name) {
    const s = w.Kanban設定 || {};
    const 固定名 = (s?.固定右フレーム?.画像名) || 固定右名;
    const set = 画像候補名セット();
    const target = 正規化(name);

    if (target === "その他") {
      return records.filter(r => {
        const b = 正規化(所属名(r));
        return b !== 正規化(固定名) && !set.has(b);
      });
    } else {
      return records.filter(r => 正規化(所属名(r)) === target);
    }
  }

  /* ========================= 座標・配置 ========================= */

  function パネル内座標(panelWidth, idx) {
    const 開始X = 20, 開始Y = 20, 間隔X = 160, 間隔Y = 56;
    const 列数 = Math.max(1, Math.floor((panelWidth - 開始X) / 間隔X));
    const col = idx % 列数;
    const row = Math.floor(idx / 列数);
    return { x: 開始X + col * 間隔X, y: 開始Y + row * 間隔Y };
  }

  function 色DBG_初期表示() {
    if (!DEBUG色) return;
    const 色マップ = (w.Kanban設定 && w.Kanban設定.ラベル色マップ) || {};
    console.log("[色DBG] ラベル色マップのキー一覧=", Object.keys(色マップ));
  }

  function 配置する(ctx, recs, panel) {
    const { doc, レイヤ, 左パネル, 右パネル, 左画像, 右画像 } = ctx;
    const panelEl = (panel === "右") ? 右パネル : 左パネル;
    const imgEl = (panel === "右") ? 右画像 : 左画像;
    const pr = panelEl.getBoundingClientRect();
    const lr = レイヤ.getBoundingClientRect();
    const offX = pr.left - lr.left;
    const offY = pr.top  - lr.top;

    // ★ 画像の実際の表示サイズとオフセットを計算（object-fit: contain対応）
    const imgDisplay = w.画像の実表示サイズを取得
      ? w.画像の実表示サイズを取得(imgEl, pr.width, pr.height)
      : { width: pr.width, height: pr.height, offsetX: 0, offsetY: 0 };

    const 色集計 = { 全:0, ヒット:0, ミス:0, 空:0, byTable:{} };
    const 色集計45173J = { 全:0, 一致:0, 不一致:0, 空:0, sample出力件数: {} };

    const 色マップ = (w.Kanban設定 && w.Kanban設定.ラベル色マップ) || {};
    色DBG_初期表示();

    recs.forEach((rec, i) => {
      const nh = 取得_NumHash(rec);
      const kx = (panel === "右") ? "NumX2" : "NumX";
      const ky = (panel === "右") ? "NumY2" : "NumY";

      let storedX = Number(nh[kx]);
      let storedY = Number(nh[ky]);

      let x, y; // パネル相対のピクセル座標

      if (!Number.isFinite(storedX) || !Number.isFinite(storedY)) {
        // 座標が未設定の場合：グリッド配置
        const p = パネル内座標(pr.width, i);
        x = p.x; y = p.y;
      } else if (w.is旧ピクセル形式 && w.is旧ピクセル形式(storedX, storedY)) {
        // ★ 旧形式（ピクセル）：そのまま使用（後方互換性）
        x = storedX;
        y = storedY;
        console.log(`[表示] 旧形式 id=${rec.ResultId || rec.IssueId}, panel=${panel}, stored=(${storedX}, ${storedY}) → panel=(${Math.round(x)}, ${Math.round(y)})`);
      } else if (w.パーセンテージからピクセル && storedX <= 100 && storedY <= 100) {
        // ★ 新形式（パーセンテージ）：画像サイズを基準にピクセルに変換
        const converted = w.パーセンテージからピクセル(storedX, storedY, imgDisplay.width, imgDisplay.height);
        // 画像相対座標にオフセットを加えてパネル相対座標に変換
        x = converted.pixelX + imgDisplay.offsetX;
        y = converted.pixelY + imgDisplay.offsetY;

        // ★ デバッグログ：表示時の座標変換を詳細に出力
        console.log(`[表示] パーセンテージ形式 id=${rec.ResultId || rec.IssueId}, panel=${panel}`);
        console.log(`  stored=(${storedX}%, ${storedY}%) → 画像相対=(${Math.round(converted.pixelX)}, ${Math.round(converted.pixelY)})`);
        console.log(`  offset=(${Math.round(imgDisplay.offsetX)}, ${Math.round(imgDisplay.offsetY)}) → panel相対=(${Math.round(x)}, ${Math.round(y)})`);
        console.log(`  画像表示サイズ: ${Math.round(imgDisplay.width)}x${Math.round(imgDisplay.height)}, container: ${Math.round(pr.width)}x${Math.round(pr.height)}`);
      } else {
        // フォールバック：そのまま使用
        x = storedX;
        y = storedY;
        console.log(`[表示] フォールバック id=${rec.ResultId || rec.IssueId}, panel=${panel}, stored=(${storedX}, ${storedY}) → panel=(${Math.round(x)}, ${Math.round(y)})`);
      }

      const layerX = x + offX;
      const layerY = y + offY;

      // ===== 既存：ClassCベースの色判定（生値でマップ照合） =====
      const ch = 取得_ClassHash(rec);
      const cc_raw = ch.ClassC || rec.ClassC || "";
      let   hit = Object.prototype.hasOwnProperty.call(色マップ, cc_raw);
      let   色設定 = (hit ? 色マップ[cc_raw] : {}) || {};

      // ===== 45173 の「ClassJ=会計年度」監視ログ ＋ 特別色適用 =====
      const tid = rec._tableId || 0;
      if (tid === 45173) {
        const jRaw  = (ch.ClassJ != null ? ch.ClassJ : rec.ClassJ) || "";
        const jNorm = (function 正規(s){ try { return (s==null?"":String(s)).normalize("NFKC").trim(); } catch { return (s==null?"":String(s)).trim(); } })(jRaw);
        const isTarget = (jNorm === "会計年度");

        if (DEBUG色45173J) {
          色集計45173J.全++;
          if (!jNorm) 色集計45173J.空++; else if (isTarget) 色集計45173J.一致++; else 色集計45173J.不一致++;
          const sKey = "45173";
          const c = (色集計45173J.sample出力件数[sKey] || 0);
          if (c < 2) {
            console.log(`[色DBG45173] sample id=${Number(rec?.ResultId ?? rec?.IssueId)}, ` +
                        `ClassJ_raw=「${jRaw}」, ClassJ_norm=「${jNorm}」, 一致(会計年度)=${isTarget}, ` +
                        `ClassC=「${cc_raw}」, ClassC_mapHit=${hit}`);
            色集計45173J.sample出力件数[sKey] = c + 1;
          }
          if (isTarget && !hit) {
            console.warn(`[色DBG45173] 条件一致(会計年度)だが色未適用: id=${Number(rec?.ResultId ?? rec?.IssueId)} ` +
                         `→ 色マップが ClassJ/所属名ベースではなく ClassC ベースの可能性`);
          }
        }

        // ★ 特別ルール：ClassJ=会計年度なら薄い赤を強制適用（マップ非依存）
        if (isTarget) {
          色設定 = { 背景: "#ffe5e5", 枠線: "#f5aaaa" };
          hit = true;
          if (DEBUG色45173J) {
            console.log(`[色DBG45173] 特別色適用: id=${Number(rec?.ResultId ?? rec?.IssueId)} (ClassJ=会計年度)`, 色設定);
          }
        }
      }

      // ===== 既存：集計（ClassC/特別色を反映した最終ヒット） =====
      色集計.全++;
      色集計.byTable[tid] = (色集計.byTable[tid] || { 全:0, ヒット:0, ミス:0, 空:0 });
      色集計.byTable[tid].全++;
      if (!cc_raw && !(tid === 45173)) {
        色集計.空++;  色集計.byTable[tid].空++;
      } else if (hit) {
        色集計.ヒット++; 色集計.byTable[tid].ヒット++;
      } else {
        色集計.ミス++; 色集計.byTable[tid].ミス++;
      }

      if (DEBUG色 && (色集計.byTable[tid].全 <= 2)) {
        console.log(`[色DBG] sample tid=${tid}, id=${Number(rec?.ResultId ?? rec?.IssueId)}, ` +
                    `ClassC=「${cc_raw}」, mapHit=${hit}, 色設定=`, 色設定 || null);
      }

      // ラベル生成
      w.KanbanLabels.ラベル作成(
        doc,
        レイヤ,
        ラベル表示名(rec, i),
        layerX,
        layerY,
        Number(rec?.ResultId ?? rec?.IssueId),
        {
          背景色: 色設定.背景 || null,
          枠線色: 色設定.枠線 || null,
          メタ: {
            tableId: tid,
            classC: cc_raw,
            色キー: hit ? (cc_raw || "ClassJ:会計年度") : cc_raw,
            ヒット: !!hit
          }
        }
      );
    });

    if (DEBUG色) {
      console.log("[色DBG] 集計 全=", 色集計.全,
                  " ヒット=", 色集計.ヒット,
                  " ミス=", 色集計.ミス,
                  " 空=", 色集計.空,
                  " byTable=", 色集計.byTable);
    }

    if (DEBUG色45173J) {
      console.log("[色DBG45173] ClassJ=会計年度 集計 全=", 色集計45173J.全,
                  " 一致=", 色集計45173J.一致,
                  " 不一致=", 色集計45173J.不一致,
                  " 空=", 色集計45173J.空);
    }
  }

  /* ========================= 起動 ========================= */

  async function Kanban起動(container) {
    if (!w.KanbanFrameSingle || !w.PleasanterApi || !w.PleasanterApi別 || !w.PleasanterApi_121624) {
      console.error("依存スクリプト未読込（KanbanFrameSingle / PleasanterApi / PleasanterApi別 / PleasanterApi_121624）");
      return;
    }

    // ★ページを開くたびに前回の左選択をリセット（config初期値「会計課」を使用させる）
    try {
      if (window.Kanban現在 && "左画像名" in window.Kanban現在) {
        delete window.Kanban現在.左画像名;
      }
    } catch {}

    // 単一iframe生成（タブマネージャーのコンテナ内に配置）
    w.KanbanFrameSingle.初期化(container);

    // 画像メニュー生成（タブマネージャーのコンテナ内に配置）
    if (w.画像メニュー生成) {
      await w.画像メニュー生成(container);
    }

    // 3テーブル取得
    let recs1 = [], recs2 = [], recs3 = [];
    try {
      recs1 = await w.PleasanterApi.レコード取得();
      recs2 = await w.PleasanterApi別.レコード取得();
      recs3 = await w.PleasanterApi_121624.レコード取得();
    } catch (e) {
      console.error("レコード取得失敗:", e);
    }
    recs1.forEach(r => r._tableId = 45208);
    recs2.forEach(r => r._tableId = 45173);
    recs3.forEach(r => r._tableId = 121624);

    const records = [...recs1, ...recs2, ...recs3];

    if (DEBUG) {
      console.log("統合レコード件数:", records.length);
    }

    // 共有キャッシュ
    w._recordsCache = records;

    // フレーム準備待ち
    const ctx = await (async function 待(ms = 6000) {
      const t0 = Date.now();
      while (!w.KanbanFrameSingle?._ctx?.doc) {
        await new Promise(r => setTimeout(r, 30));
        if (Date.now() - t0 > ms) return null;
      }
      return w.KanbanFrameSingle._ctx;
    })();
    if (!ctx) { console.error("フレーム未準備"); return; }

    // ★ OS表示倍率対応：画像ロード完了とレイアウト確定を待つ
    // 右画像のロード完了を待つ（初期表示時に必須）
    if (ctx.右画像) {
      try {
        await w.画像ロード待機(ctx.右画像);
        console.log("[初期化] 右画像のロード完了");
      } catch (err) {
        console.warn("[初期化] 右画像のロード失敗:", err.message);
      }
    }

    // レイアウト確定を待つ（requestAnimationFrameで2フレーム待機）
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // コンテナサイズを確認
          const 右Rect = ctx.右パネル.getBoundingClientRect();
          const 左Rect = ctx.左パネル.getBoundingClientRect();
          const 包むRect = ctx.包む.getBoundingClientRect();
          const iframeRect = ctx.iframe.getBoundingClientRect();

          console.log(`[初期化レイアウト確定] iframe実サイズ: ${Math.round(iframeRect.width)}x${Math.round(iframeRect.height)}`);
          console.log(`[初期化レイアウト確定] 包むサイズ: ${Math.round(包むRect.width)}x${Math.round(包むRect.height)}`);
          console.log(`[初期化レイアウト確定] 左パネル: ${Math.round(左Rect.width)}x${Math.round(左Rect.height)}, 右パネル: ${Math.round(右Rect.width)}x${Math.round(右Rect.height)}`);

          // コンテナサイズの妥当性チェック
          if (右Rect.width < 100 || 左Rect.width < 100) {
            console.warn(`[初期化] パネルサイズが異常に小さい可能性: 左=${Math.round(左Rect.width)}px, 右=${Math.round(右Rect.width)}px`);
          }
          resolve();
        });
      });
    });

    // 初期の左右抽出
    const s = w.Kanban設定 || {};
    const 固定右_正規 = 正規化(s?.固定右フレーム?.画像名 || 固定右名);
    const 左名_現在   = 現在の左画像名();

    const 右対象 = records.filter(r => 正規化(所属名(r)) === 固定右_正規);

    if (DEBUG) {
      const cnt = { 45208: 0, 45173: 0, 121624: 0 };
      records.forEach(r => { cnt[r._tableId] = (cnt[r._tableId] || 0) + 1; });
      if (window.DEBUG_VERBOSE) console.log("テーブル別件数:", cnt);
    }

    // 左パネル：初期値がnullの場合は配置しない（メニュークリックまで待つ）
    if (左名_現在 !== null) {
      const 左対象 = 左側の抽出(records, 左名_現在);
      if (DEBUG) {
        console.log(`[初期] 左(${左名_現在})=${左対象.length}, 右(${固定右名})=${右対象.length}`);
      }
      配置する(ctx, 左対象, "左");
      if (window.DEBUG_VERBOSE) console.log("配置完了: 左=", 左対象.length, "右=", 右対象.length);
    } else {
      if (DEBUG) {
        console.log(`[初期] 左=未選択（表示なし）, 右(${固定右名})=${右対象.length}`);
      }
      if (window.DEBUG_VERBOSE) console.log("初期表示: 左パネルは空（メニューから選択してください）");
    }

    // 右パネル：常に表示（サーバー室固定）
    配置する(ctx, 右対象, "右");

    /* ---------- 画像選択（左切替。「その他」対応） ---------- */
    w.addEventListener("kanban:imageSelected", async (ev) => {
      try {
        const name = ev?.detail?.name || "";
        const 固定名 = s?.固定右フレーム?.画像名 || 固定右名;

        if (name === 固定名) {
          console.warn("左で『サーバー室』は選択不可のため無視しました。");
          return;
        }

        w.Kanban現在 = w.Kanban現在 || {};
        w.Kanban現在.左画像名 = name || "その他";

        let recs = Array.isArray(w._recordsCache) ? w._recordsCache : [];
        if (!Array.isArray(recs)) recs = [];
        w._recordsCache = recs;

        const 左抽出 = 左側の抽出(recs, w.Kanban現在.左画像名);
        const 右抽出 = recs.filter(r => 正規化(所属名(r)) === 正規化(固定名));

        if (DEBUG) {
          console.log(`[再選択] 左(${w.Kanban現在.左画像名})=${左抽出.length}, 右(${固定名})=${右抽出.length}`);
        }

        const { レイヤ } = w.KanbanFrameSingle._ctx || {};
        if (レイヤ) Array.from(レイヤ.querySelectorAll(".ラベル")).forEach(n => n.remove());

        配置する(w.KanbanFrameSingle._ctx, 左抽出, "左");
        配置する(w.KanbanFrameSingle._ctx, 右抽出, "右");
      } catch (e) {
        console.error("メニュー選択処理失敗:", e?.message || e);
      }
    });
  }

  w.Kanban起動 = Kanban起動;
})(window);

if (window.DEBUG_VERBOSE) console.log("✓ KanbanBootstrap 初期化完了");

/* ===============================================================
 * タブマネージャー
 * 複数のパネルをタブで切り替える機能
 * ============================================================= */
(function(w) {
  "use strict";

  let currentTabId = null;
  let tabs = [];
  let tabBarElement = null;
  let containerWrapperElement = null;

  // タブバーを作成
  function createTabBar(tabConfigs) {
    const dpr = window.devicePixelRatio || 1;
    const scale = 1 / dpr;

    const tabBar = document.createElement("div");
    Object.assign(tabBar.style, {
      position: "absolute",
      top: "24px",
      left: "500px",
      width: "1150px",  // 緑200px + 黄色950px
      height: "40px",
      display: "flex",
      gap: "0",
      background: "#f0f0f0",
      border: "2px solid #ccc",
      borderRadius: "6px 6px 0 0",
      overflow: "hidden",
      zIndex: 10001,
      // DPR対応のスケーリング
      transform: dpr > 1 ? `scale(${scale})` : "none",
      transformOrigin: "top left"
    });

    tabConfigs.forEach((config, index) => {
      const tabButton = document.createElement("button");
      tabButton.textContent = config.ラベル;
      tabButton.dataset.tabId = config.id;

      Object.assign(tabButton.style, {
        flex: "1",
        border: "none",
        background: "#f0f0f0",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        padding: "8px 16px",
        transition: "all 0.2s",
        borderRight: index < tabConfigs.length - 1 ? "1px solid #ccc" : "none"
      });

      // ホバー効果
      tabButton.addEventListener("mouseenter", () => {
        if (currentTabId !== config.id) {
          tabButton.style.background = "#e0e0e0";
        }
      });
      tabButton.addEventListener("mouseleave", () => {
        if (currentTabId !== config.id) {
          tabButton.style.background = "#f0f0f0";
        }
      });

      // クリックイベント
      tabButton.addEventListener("click", () => {
        w.KanbanTabManager.switchTab(config.id);
      });

      tabBar.appendChild(tabButton);
    });

    document.body.appendChild(tabBar);
    return tabBar;
  }

  // コンテナラッパーを作成
  function createContainerWrapper() {
    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      position: "absolute",
      top: "64px",  // タブバーの下（黄色枠の絶対位置）
      left: "500px",
      zIndex: 9998
    });
    document.body.appendChild(wrapper);
    return wrapper;
  }

  // タブの表示を更新
  function updateTabDisplay(tabId) {
    // タブボタンのスタイルを更新
    if (tabBarElement) {
      const buttons = tabBarElement.querySelectorAll("button");
      buttons.forEach(btn => {
        if (btn.dataset.tabId === tabId) {
          btn.style.background = "#fff";
          btn.style.fontWeight = "700";
          btn.style.borderBottom = "3px solid #4CAF50";
        } else {
          btn.style.background = "#f0f0f0";
          btn.style.fontWeight = "500";
          btn.style.borderBottom = "none";
        }
      });
    }

    // コンテナの表示/非表示を切り替え
    tabs.forEach(tab => {
      if (tab.container) {
        tab.container.style.display = (tab.id === tabId) ? "block" : "none";
      }
    });

    currentTabId = tabId;
  }

  // タブマネージャーの公開API
  w.KanbanTabManager = {
    // 初期化
    init: function(tabConfigs) {
      console.log("[TabManager] 初期化開始:", tabConfigs.length, "個のタブ");

      // タブバーを作成
      tabBarElement = createTabBar(tabConfigs);

      // コンテナラッパーを作成
      containerWrapperElement = createContainerWrapper();

      // 各タブのコンテナを作成してrenderを実行
      tabConfigs.forEach(config => {
        const container = document.createElement("div");
        container.dataset.tabId = config.id;
        container.style.display = "none";
        containerWrapperElement.appendChild(container);

        // renderを実行（タブの内容を生成）
        if (typeof config.render === "function") {
          try {
            config.render(container);
            console.log("[TabManager] タブ", config.ラベル, "のrenderが完了");
          } catch (e) {
            console.error("[TabManager] タブ", config.ラベル, "のrender失敗:", e);
          }
        }

        tabs.push({
          id: config.id,
          label: config.ラベル,
          container: container,
          render: config.render
        });
      });

      // 最初のタブを表示
      if (tabs.length > 0) {
        this.switchTab(tabs[0].id);
      }

      console.log("[TabManager] 初期化完了");
    },

    // タブを切り替え
    switchTab: function(tabId) {
      console.log("[TabManager] タブ切り替え:", tabId);
      updateTabDisplay(tabId);
    },

    // 動的にタブを追加
    addTab: function(tabConfig) {
      console.log("[TabManager] タブ追加:", tabConfig.ラベル);
      // TODO: 動的追加の実装（Phase 2）
    }
  };
})(window);

if (window.DEBUG_VERBOSE) console.log("✓ KanbanTabManager 初期化完了");

/* ===============================================================
 * 自動起動（メイン.txt の機能を統合）
 * ページ読み込み完了後、自動的にKanban起動を実行
 * ============================================================= */
if (window.DEBUG_VERBOSE) {
  console.log("========================================");
  console.log("Kanban All-in-One システム読み込み完了");
  console.log("========================================");
}

// 自動起動関数（タブマネージャーを使用）
(function 自動起動() {
  // タブ定義
  const タブ設定 = [
    {
      id: "kanban-image",
      ラベル: "画像カンバン",
      render: function(container) {
        // 現在の画像カンバン機能を実行
        console.log("[TabManager] 画像カンバンパネルを初期化中...");
        if (window.Kanban起動) {
          window.Kanban起動(container);
        } else {
          console.error("Kanban起動 関数が見つかりません");
        }
      }
    },
    {
      id: "summary-panel",
      ラベル: "サマリ",
      render: function(container) {
        console.log("[TabManager] サマリパネルを初期化中...");

        // ===== サマリパネル用のユーティリティ関数 =====

        // ClassHashから値を安全に取得
        function safeGetClass(rec, key) {
          let ch = rec && rec.ClassHash;
          if (typeof ch === "string") {
            try { ch = JSON.parse(ch); } catch { ch = {}; }
          }
          if (!ch || typeof ch !== "object") ch = {};
          const val = ch[key] != null ? ch[key] : (rec && rec[key]);
          return val != null ? String(val).normalize("NFKC").trim() : "";
        }

        // 所属名を取得（テーブルごとに異なるキー）
        function getBelongName(rec) {
          const map = { 45208: "ClassO", 45173: "ClassA", 121624: "ClassB" };
          const key = map[rec?._tableId] || "ClassO";
          return safeGetClass(rec, key);
        }

        // セグメント（ClassC）を取得
        function getSegment(rec) {
          return safeGetClass(rec, "ClassC");
        }

        // セグメント名を短縮形に変換
        function getSegmentShortName(segment) {
          if (segment === "個人番号利用事務セグメント") return "基幹";
          if (segment === "LGWANセグメント") return "LGWAN";
          if (segment === "インターネット接続セグメント") return "インターネット";
          return "その他";
        }

        // データを集計
        function aggregateData() {
          const recs = Array.isArray(window._recordsCache) ? window._recordsCache : [];
          const s = window.Kanban設定 || {};
          const 固定右名 = s?.固定右フレーム?.画像名 || "サーバー室";

          // テーブル別集計
          const byTable = { 45208: 0, 45173: 0, 121624: 0 };

          // セグメント別集計
          const bySegment = {
            "個人番号利用事務セグメント": 0,
            "LGWANセグメント": 0,
            "インターネット接続セグメント": 0,
            "その他": 0
          };

          // 部署別・セグメント別・職員数の詳細集計
          // byDeptDetail[部署名] = { 基幹: n, LGWAN: n, インターネット: n, その他: n, 職員: n }
          const byDeptDetail = {};

          // サーバー室集計
          let serverRoomCount = 0;

          // 画像候補の部署名リストを取得
          const deptNames = (s.画像候補 || []).map(function(x) { return x?.名前; }).filter(Boolean);

          for (const r of recs) {
            const tid = r?._tableId;
            const belong = getBelongName(r);
            const segment = getSegment(r);
            const segShort = getSegmentShortName(segment);

            // テーブル別
            if (byTable[tid] !== undefined) byTable[tid]++;

            // セグメント別
            if (bySegment[segment] !== undefined) {
              bySegment[segment]++;
            } else {
              bySegment["その他"]++;
            }

            // 部署別詳細集計
            if (belong && belong !== 固定右名) {
              if (!byDeptDetail[belong]) {
                byDeptDetail[belong] = { 基幹: 0, LGWAN: 0, インターネット: 0, その他: 0, 職員: 0 };
              }
              // セグメント別にカウント（PC台帳とその他テーブル）
              if (tid === 45208 || tid === 121624) {
                byDeptDetail[belong][segShort]++;
              }
              // 職員数（45173テーブル）
              if (tid === 45173) {
                byDeptDetail[belong].職員++;
              }
            }

            // サーバー室
            if (belong === 固定右名 && tid === 45208) {
              serverRoomCount++;
            }
          }

          // 部署リストを画像候補の順序に並べる
          const deptList = [];
          for (const name of deptNames) {
            if (name !== 固定右名 && byDeptDetail[name]) {
              deptList.push({ name: name, data: byDeptDetail[name] });
            }
          }
          // 候補リストにない部署があれば最後に追加
          for (const name of Object.keys(byDeptDetail)) {
            if (!deptNames.includes(name)) {
              deptList.push({ name: name, data: byDeptDetail[name] });
            }
          }

          const total = recs.length;
          const pcTotal = byTable[45208];

          return { byTable, bySegment, byDeptDetail, deptList, serverRoomCount, pcTotal, total };
        }

        // プログレスバーのHTML生成
        function progressBar(value, max, color) {
          const pct = max > 0 ? Math.round((value / max) * 100) : 0;
          return '<div style="display:flex;align-items:center;gap:8px;">' +
            '<div style="flex:1;height:16px;background:#e0e0e0;border-radius:8px;overflow:hidden;">' +
            '<div style="width:' + pct + '%;height:100%;background:' + color + ';border-radius:8px;transition:width 0.3s;"></div>' +
            '</div>' +
            '<span style="min-width:45px;text-align:right;font-size:12px;color:#666;">' + pct + '%</span>' +
            '</div>';
        }

        // サマリパネルのHTMLを生成
        function renderSummary() {
          const data = aggregateData();
          const total = data.total;

          // セグメント色マップ
          const segColors = {
            "個人番号利用事務セグメント": "#f5aaaa",
            "LGWANセグメント": "#99bbee",
            "インターネット接続セグメント": "#88cc88",
            "その他": "#999"
          };

          // 短縮名用の色マップ
          const segShortColors = {
            "基幹": "#f5aaaa",
            "LGWAN": "#99bbee",
            "インターネット": "#88cc88",
            "その他": "#bbb",
            "職員": "#a5d6a7"
          };

          let html = '';
          // タブバー・画像カンバンと同じ幅（緑200px + 黄色950px = 1150px）
          html += '<div id="summary-content" style="padding:20px;font-family:sans-serif;background:#f8f9fa;min-height:100%;box-sizing:border-box;width:1150px;">';

          // ===== ヘッダー（更新ボタン付き） =====
          html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">';
          html += '<span style="font-size:11px;color:#999;" id="summary-update-time"></span>';
          html += '<button id="summary-refresh-btn" style="padding:6px 16px;font-size:13px;background:#1976d2;color:#fff;border:none;border-radius:4px;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.2);">🔄 データ更新</button>';
          html += '</div>';

          // ===== 上段：全体サマリ + セグメント別 + サーバー室（3カラム） =====
          html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:24px;">';

          // --- 全体サマリ ---
          html += '<div>';
          html += '<h3 style="margin:0 0 12px 0;font-size:15px;color:#333;border-bottom:2px solid #1976d2;padding-bottom:6px;">📊 全体サマリ</h3>';
          html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';

          // カード生成関数
          function statCard(label, value, sublabel, bgColor) {
            return '<div style="background:' + bgColor + ';border-radius:6px;padding:12px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,0.1);">' +
              '<div style="font-size:24px;font-weight:700;color:#333;">' + value + '</div>' +
              '<div style="font-size:12px;color:#666;margin-top:2px;">' + label + '</div>' +
              (sublabel ? '<div style="font-size:10px;color:#999;">' + sublabel + '</div>' : '') +
              '</div>';
          }

          html += statCard('PC台数', data.byTable[45208], '(45208)', '#e3f2fd');
          html += statCard('職員数', data.byTable[45173], '(45173)', '#e8f5e9');
          html += statCard('その他', data.byTable[121624], '(121624)', '#fff3e0');
          html += statCard('合計', total, '', '#f3e5f5');
          html += '</div></div>';

          // --- セグメント別内訳 ---
          html += '<div>';
          html += '<h3 style="margin:0 0 12px 0;font-size:15px;color:#333;border-bottom:2px solid #7b1fa2;padding-bottom:6px;">🎨 セグメント別内訳</h3>';
          html += '<div style="background:#fff;border-radius:6px;padding:12px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">';

          const segments = ["個人番号利用事務セグメント", "LGWANセグメント", "インターネット接続セグメント"];
          for (const seg of segments) {
            const cnt = data.bySegment[seg] || 0;
            const shortName = seg.replace("セグメント", "");
            html += '<div style="margin-bottom:10px;">';
            html += '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">';
            html += '<span style="font-size:12px;"><span style="display:inline-block;width:10px;height:10px;background:' + segColors[seg] + ';border-radius:2px;margin-right:6px;"></span>' + shortName + '</span>';
            html += '<span style="font-size:12px;font-weight:600;">' + cnt + '件</span>';
            html += '</div>';
            html += progressBar(cnt, total, segColors[seg]);
            html += '</div>';
          }
          html += '</div></div>';

          // --- サーバー室状況 ---
          html += '<div>';
          html += '<h3 style="margin:0 0 12px 0;font-size:15px;color:#333;border-bottom:2px solid #f57c00;padding-bottom:6px;">🖥️ サーバー室状況</h3>';
          html += '<div style="background:#fff;border-radius:6px;padding:12px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
          html += '<span style="font-size:13px;">配置済みPC</span>';
          html += '<span style="font-size:22px;font-weight:700;color:#f57c00;">' + data.serverRoomCount + '件</span>';
          html += '</div>';
          html += progressBar(data.serverRoomCount, data.pcTotal, '#ff9800');
          html += '<div style="text-align:right;font-size:10px;color:#999;margin-top:4px;">全PC台数: ' + data.pcTotal + '件</div>';
          html += '</div></div>';

          html += '</div>'; // 上段グリッド終了

          // ===== 下段：部署別内訳（2カラム表示） =====
          html += '<div>';
          html += '<h3 style="margin:0 0 12px 0;font-size:15px;color:#333;border-bottom:2px solid #388e3c;padding-bottom:6px;">🏢 部署別内訳</h3>';
          html += '<div style="background:#fff;border-radius:6px;padding:0;box-shadow:0 2px 4px rgba(0,0,0,0.1);overflow:hidden;">';

          // 部署リストを2分割
          const halfLen = Math.ceil(data.deptList.length / 2);
          const leftDepts = data.deptList.slice(0, halfLen);
          const rightDepts = data.deptList.slice(halfLen);

          // テーブルヘッダー生成関数
          function tableHeader() {
            let h = '<tr style="background:#f5f5f5;">';
            h += '<th style="padding:8px 4px;text-align:left;border-bottom:2px solid #ddd;font-weight:600;font-size:10px;width:50px;">部署名</th>';
            h += '<th style="padding:8px 4px;text-align:center;border-bottom:2px solid #ddd;font-weight:600;font-size:10px;color:' + segShortColors["基幹"] + ';">基幹</th>';
            h += '<th style="padding:8px 4px;text-align:center;border-bottom:2px solid #ddd;font-weight:600;font-size:10px;color:' + segShortColors["LGWAN"] + ';">LGWAN</th>';
            h += '<th style="padding:8px 4px;text-align:center;border-bottom:2px solid #ddd;font-weight:600;font-size:10px;color:' + segShortColors["インターネット"] + ';">ﾈｯﾄ</th>';
            h += '<th style="padding:8px 4px;text-align:center;border-bottom:2px solid #ddd;font-weight:600;font-size:10px;color:' + segShortColors["その他"] + ';">他</th>';
            h += '<th style="padding:8px 4px;text-align:center;border-bottom:2px solid #ddd;font-weight:600;font-size:10px;color:' + segShortColors["職員"] + ';">職員</th>';
            h += '</tr>';
            return h;
          }

          // テーブル行生成関数
          function tableRows(depts) {
            let rows = '';
            if (depts.length === 0) {
              rows += '<tr><td colspan="6" style="padding:12px;text-align:center;color:#999;font-size:11px;">データなし</td></tr>';
            } else {
              depts.forEach(function(dept, idx) {
                const bgColor = idx % 2 === 0 ? '#fff' : '#fafafa';
                const d = dept.data;
                rows += '<tr style="background:' + bgColor + ';">';
                rows += '<td style="padding:6px 4px;border-bottom:1px solid #eee;font-weight:500;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:50px;" title="' + dept.name + '">' + dept.name + '</td>';
                rows += '<td style="padding:6px 4px;text-align:center;border-bottom:1px solid #eee;font-size:11px;">' + (d.基幹 || 0) + '</td>';
                rows += '<td style="padding:6px 4px;text-align:center;border-bottom:1px solid #eee;font-size:11px;">' + (d.LGWAN || 0) + '</td>';
                rows += '<td style="padding:6px 4px;text-align:center;border-bottom:1px solid #eee;font-size:11px;">' + (d.インターネット || 0) + '</td>';
                rows += '<td style="padding:6px 4px;text-align:center;border-bottom:1px solid #eee;font-size:11px;">' + (d.その他 || 0) + '</td>';
                rows += '<td style="padding:6px 4px;text-align:center;border-bottom:1px solid #eee;font-size:11px;font-weight:600;color:#2e7d32;">' + (d.職員 || 0) + '</td>';
                rows += '</tr>';
              });
            }
            return rows;
          }

          // 2カラムテーブルレイアウト
          html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0;">';

          // 左テーブル
          html += '<div style="border-right:1px solid #eee;">';
          html += '<table style="width:100%;border-collapse:collapse;">';
          html += '<thead>' + tableHeader() + '</thead>';
          html += '<tbody>' + tableRows(leftDepts) + '</tbody>';
          html += '</table></div>';

          // 右テーブル
          html += '<div>';
          html += '<table style="width:100%;border-collapse:collapse;">';
          html += '<thead>' + tableHeader() + '</thead>';
          html += '<tbody>' + tableRows(rightDepts) + '</tbody>';
          html += '</table></div>';

          html += '</div>'; // 2カラムグリッド終了

          html += '</div></div>'; // 部署別セクション終了

          html += '</div>';
          return html;
        }

        // 更新時刻を設定
        function updateTimestamp() {
          const el = document.getElementById('summary-update-time');
          if (!el) return;
          const now = new Date();
          const timeStr = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');
          el.textContent = '最終更新: ' + timeStr;
        }

        // APIからデータを再取得してキャッシュを更新
        async function fetchData() {
          console.log("[サマリパネル] データ取得開始...");
          try {
            const recs1 = await window.PleasanterApi.レコード取得();
            const recs2 = await window.PleasanterApi別.レコード取得();
            const recs3 = await window.PleasanterApi_121624.レコード取得();

            // テーブルIDを付与
            recs1.forEach(function(r) { r._tableId = 45208; });
            recs2.forEach(function(r) { r._tableId = 45173; });
            recs3.forEach(function(r) { r._tableId = 121624; });

            // キャッシュを更新
            window._recordsCache = recs1.concat(recs2).concat(recs3);
            console.log("[サマリパネル] データ取得完了:", window._recordsCache.length, "件");
            return true;
          } catch (e) {
            console.error("[サマリパネル] データ取得エラー:", e);
            return false;
          }
        }

        // 再描画関数
        function refresh() {
          container.innerHTML = renderSummary();
          updateTimestamp();
          // 更新ボタンにイベント再設定
          const btn = document.getElementById('summary-refresh-btn');
          if (btn) {
            btn.addEventListener('click', async function() {
              console.log("[サマリパネル] 手動更新（データ再取得）");
              btn.disabled = true;
              btn.textContent = '取得中...';
              await fetchData();
              refresh();
            });
          }
        }

        // 初期表示
        refresh();

        // タブ切り替え時（表示時）にデータ再取得＆更新を発火
        // MutationObserverでdisplay属性の変化を監視
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(async function(mutation) {
            if (mutation.attributeName === 'style') {
              const display = container.style.display;
              if (display !== 'none' && display !== '') {
                console.log("[サマリパネル] タブ選択検知、データ再取得");
                await fetchData();
                refresh();
              }
            }
          });
        });
        observer.observe(container, { attributes: true, attributeFilter: ['style'] });

        console.log("[TabManager] サマリパネルの初期化完了");
      }
    }
  ];

  // タブマネージャーを初期化
  function タブマネージャー起動() {
    if (window.KanbanTabManager) {
      console.log("▶ タブマネージャーを起動します");
      window.KanbanTabManager.init(タブ設定);
    } else {
      console.error("KanbanTabManager が見つかりません");
    }
  }

  if (document.readyState === "loading") {
    // DOMがまだ読み込み中の場合は、DOMContentLoadedを待つ
    document.addEventListener("DOMContentLoaded", function 起動実行() {
      if (window.DEBUG_VERBOSE) console.log("▶ DOMContentLoaded: タブマネージャー起動を開始します");
      setTimeout(タブマネージャー起動, 100); // わずかな遅延で確実に初期化
    });
  } else if (document.readyState === "interactive" || document.readyState === "complete") {
    // DOMが既に読み込まれている場合は即座に実行
    console.log("▶ DOM既に読み込み済み: タブマネージャー起動を開始します");
    setTimeout(タブマネージャー起動, 100);
  }
})();

if (window.DEBUG_VERBOSE) console.log("✓ 自動起動設定完了（タブマネージャーを使用）");

})(window);
