/* ===== 開始: kanban-bootstrap.js ===== */
/* ===============================================================
 * kanban-bootstrap.js（統合版 Ver5｜画像切替で再配置・右固定・3テーブル対応）
 *
 * 【所属判定キー（すべて ClassHash 内が優先／無ければ rec 直下フォールバック）】
 *   - 45208  : ClassO
 *   - 45173  : ClassA
 *   - 121624 : ClassB
 *
 * 【ラベル表示テキスト】
 *   - 45173 / 121624 : ClassHash.ClassC を使用（無ければ従来候補）
 *   - 45208          : 従来のタイトル系（Title / ItemTitle / Name / Subject / TitleA / DescriptionA）
 *
 * 【座標キー（読み取りのみ。本ファイルでは保存は行わない）】
 *   - 左パネル:  NumX / NumY（NumHash内）
 *   - 右パネル:  NumX2 / NumY2（NumHash内）
 *
 * 比較は NFKC 正規化＋trim（全角/半角や空白の差異を吸収）
 * 画像切替イベント（kanban:imageSelected）で左側を再抽出し直して再配置
 * ============================================================= */
(function (w) {
  "use strict";

  /* ========================= 設定 ========================= */
  const DEBUG = false;        // 日本語コメント：全体デバッグ（大量ログ防止のため既定false）
  const DEBUG色 = true;       // 日本語コメント：色分け＆ClassHashデバッグ用（最小限ログ）
  const DEBUG色45173J = true; // 日本語コメント：45173の ClassJ=会計年度 監視ログ

  // 右パネル固定の名前（設定にもあるが、ここでは既定名として保持）
  const 固定右名 = "サーバー室";

  // 所属名の判定キー（tableId → key）
  const 所属キー = {
    45208: "ClassO",
    45173: "ClassA",
    121624: "ClassB"
  };

  // ラベル表示キー（tableId → key or null）
  // null の場合は従来のタイトル系候補から選択
  const ラベルキー = {
    45208: null,
    45173: "ClassC",
    121624: "ClassC"
  };

  /* ========================= ユーティリティ ========================= */

  // NFKC正規化＋trim（normalize未実装環境も考慮）
  function 正規化(s) {
    const t = (s == null) ? "" : String(s);
    try { return t.normalize("NFKC").trim(); } catch { return t.trim(); }
  }

  // 安全に ClassHash をパースしてオブジェクトを返す（無ければ {}）
  function 取得_ClassHash(rec) {
    let ch = rec && rec.ClassHash;
    if (typeof ch === "string") {
      try { ch = JSON.parse(ch); } catch { ch = {}; }
    }
    if (!ch || typeof ch !== "object") ch = {};
    return ch;
  }

  // 安全に NumHash をパースしてオブジェクトを返す（無ければ {}）
  function 取得_NumHash(rec) {
    let nh = rec && rec.NumHash;
    if (typeof nh === "string") {
      try { nh = JSON.parse(nh); } catch { nh = {}; }
    }
    if (!nh || typeof nh !== "object") nh = {};
    return nh;
  }

  // デバッグ: ClassHash のキー一覧（必要時のみ）
  function debugClassHash(prefix, rec) {
    if (!DEBUG) return;
    const tid = rec?._tableId;
    const ch = 取得_ClassHash(rec);
    const keys = Object.keys(ch || {});
    console.log(`${prefix} ★debug ClassHash keys: ${tid}`, keys);
  }

  /* ========================= 所属名・ラベル名 ========================= */

  // 所属名（右パネル固定「サーバー室」判定や左抽出に使う）
  function 所属名(rec) {
    const tid = rec?._tableId;
    const key = 所属キー[tid] || "ClassO"; // 既定は ClassO
    const ch  = 取得_ClassHash(rec);

    // 優先：ClassHash[key] → フォールバック：rec[key] → rec.ClassO → ""
    const raw =
      (ch && ch[key] != null ? ch[key] :
       rec && rec[key] != null ? rec[key] :
       (rec && rec.ClassO != null ? rec.ClassO : ""));

    const val = 正規化(raw);

    if (DEBUG) {
      console.log(
        "所属名判定:",
        tid, "→", val, "(key:", key, ", raw:", raw, ", rawType:", typeof raw, ")"
      );
    }
    return val;
  }

  // ラベル表示名
  function ラベル表示名(rec, i) {
    const tid = rec?._tableId;
    const key = ラベルキー[tid]; // 45208 は null（従来タイトル系）
    const ch  = 取得_ClassHash(rec);

    if (key) {
      const raw = ch[key];
      const v   = 正規化(raw);
      if (DEBUG) {
        console.log(
          "ラベル表示名(ClassHash):",
          tid, "→", v || `(fallback)`, "(key:", key, ", raw:", raw, ", rawType:", typeof raw, ")"
        );
      }
      if (v) return v;
    }

    // 45208（や ClassC が空の場合）のフォールバック：従来候補
    const 候補 = [rec?.Title, rec?.ItemTitle, rec?.Name, rec?.Subject, rec?.TitleA, rec?.DescriptionA];
    const t = 候補.find(v => typeof v === "string" && v.trim && v.trim());
    const name = t ? String(t) : `ラベル${(i || 0) + 1}`;

    if (DEBUG && !key) {
      console.log("ラベル表示名(従来候補):", tid, "→", name, "(raw: undefined )");
    }
    return name;
  }

  /* ========================= 画像候補名 / 左抽出 ========================= */

  // 「その他」除外の候補名セット
  function 画像候補名セット() {
    const s = w.Kanban設定 || {};
    const set = new Set((s.画像候補 || []).map(x => x?.名前).filter(Boolean));
    set.delete("その他");
    return set;
  }

  // 現在の左画像名（直近選択 > 初期抽出 > その他）※サーバー室は除外
  function 現在の左画像名() {
    const s = w.Kanban設定 || {};
    const 固定名 = (s?.固定右フレーム?.画像名) || 固定右名;
    let name = (w.Kanban現在 && w.Kanban現在.左画像名) || (s?.初期抽出?.値) || "その他";
    if (name === 固定名) {
      const first = (s.画像候補 || []).find(x => (x.名前 || "") !== 固定名 && (x.名前 || "") !== "その他");
      name = first?.名前 || "その他";
    }
    if (!name) name = "その他";
    return name;
  }

  // 左側の抽出（name="その他"時は候補外＆固定右を除外）
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

  // 日本語コメント：グリッド状の既定配置（座標未保存時のフォールバック）
  function パネル内座標(panelWidth, idx) {
    const 開始X = 20, 開始Y = 20, 間隔X = 160, 間隔Y = 56;
    const 列数 = Math.max(1, Math.floor((panelWidth - 開始X) / 間隔X));
    const col = idx % 列数;
    const row = Math.floor(idx / 列数);
    return { x: 開始X + col * 間隔X, y: 開始Y + row * 間隔Y };
  }

  // 日本語コメント：色デバッグの一度きり初期化（マップキー一覧を表示）
  function 色DBG_初期表示() {
    if (!DEBUG色) return;
    const 色マップ = (w.Kanban設定 && w.Kanban設定.ラベル色マップ) || {};
    console.log("[色DBG] ラベル色マップのキー一覧=", Object.keys(色マップ));
  }

  function 配置する(ctx, recs, panel) {
    const { doc, レイヤ, 左パネル, 右パネル } = ctx;
    const panelEl = (panel === "右") ? 右パネル : 左パネル;
    const pr = panelEl.getBoundingClientRect();
    const lr = レイヤ.getBoundingClientRect();
    const offX = pr.left - lr.left;
    const offY = pr.top  - lr.top;

    // 日本語コメント：色デバッグ用 集計オブジェクト
    const 色集計 = { 全:0, ヒット:0, ミス:0, 空:0, byTable:{} };

    // ★ 日本語コメント：45173専用（ClassJ=会計年度）監視集計
    const 色集計45173J = { 全:0, 一致:0, 不一致:0, 空:0, sample出力件数: {} };

    const 色マップ = (w.Kanban設定 && w.Kanban設定.ラベル色マップ) || {};
    // 一度だけキー一覧を表示（複数回呼ばれても過剰にならないよう最初に呼ぶ）
    色DBG_初期表示();

    recs.forEach((rec, i) => {
      const nh = 取得_NumHash(rec);
      const kx = (panel === "右") ? "NumX2" : "NumX";
      const ky = (panel === "右") ? "NumY2" : "NumY";

      let x = Number(nh[kx]);
      let y = Number(nh[ky]);

      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        const p = パネル内座標(pr.width, i);
        x = p.x; y = p.y;
      }

      const layerX = x + offX;
      const layerY = y + offY;

      // ===== 既存：ClassCベースの色判定（生値でマップ照合） =====
      const ch = 取得_ClassHash(rec);
      const cc_raw = ch.ClassC || rec.ClassC || ""; // 日本語コメント：空/null監視のため未正規化
      let   hit = Object.prototype.hasOwnProperty.call(色マップ, cc_raw);
      let   色設定 = (hit ? 色マップ[cc_raw] : {}) || {};

      // ===== 45173 の「ClassJ=会計年度」監視ログ ＋ 特別色適用 =====
      const tid = rec._tableId || 0;
      if (tid === 45173) {
        const jRaw  = (ch.ClassJ != null ? ch.ClassJ : rec.ClassJ) || "";
        const jNorm = (function 正規(s){ try { return (s==null?"":String(s)).normalize("NFKC").trim(); } catch { return (s==null?"":String(s)).trim(); } })(jRaw);
        const isTarget = (jNorm === "会計年度");

        // 監視ログ（最小限サンプル＆集計）
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
          色設定 = { 背景: "#ffe5e5", 枠線: "#f5aaaa" }; // 日本語コメント：仕様の薄い赤
          hit = true; // 日本語コメント：適用と見なす
          if (DEBUG色45173J) {
            console.log(`[色DBG45173] 特別色適用: id=${Number(rec?.ResultId ?? rec?.IssueId)} (ClassJ=会計年度)`, 色設定);
          }
        }
      }

      // ===== 既存：集計（ClassC/特別色を反映した最終ヒット） =====
      色集計.全++;
      色集計.byTable[tid] = (色集計.byTable[tid] || { 全:0, ヒット:0, ミス:0, 空:0 });
      色集計.byTable[tid].全++;
      if (!cc_raw && !(tid === 45173)) { // 日本語コメント：45173の特別色時は空扱いにしない
        色集計.空++;  色集計.byTable[tid].空++;
      } else if (hit) {
        色集計.ヒット++; 色集計.byTable[tid].ヒット++;
      } else {
        色集計.ミス++; 色集計.byTable[tid].ミス++;
      }

      // 日本語コメント：各テーブル先頭2件のみサンプル出力（ログ爆発回避）
      if (DEBUG色 && (色集計.byTable[tid].全 <= 2)) {
        console.log(`[色DBG] sample tid=${tid}, id=${Number(rec?.ResultId ?? rec?.IssueId)}, ` +
                    `ClassC=「${cc_raw}」, mapHit=${hit}, 色設定=`, 色設定 || null);
      }

      // ラベル生成（描画側でも検証できるようメタを渡す）
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
          // 日本語コメント：どの基準で色が渡ったか最低限のメタを付与
          メタ: {
            tableId: tid,
            classC: cc_raw,
            色キー: hit ? (cc_raw || "ClassJ:会計年度") : cc_raw,
            ヒット: !!hit
          }
        }
      );
    });

    // 日本語コメント：ループ後に最小限の集計だけ出力（最終判定ベース）
    if (DEBUG色) {
      console.log("[色DBG] 集計 全=", 色集計.全,
                  " ヒット=", 色集計.ヒット,
                  " ミス=", 色集計.ミス,
                  " 空=", 色集計.空,
                  " byTable=", 色集計.byTable);
    }

    // ★ 45173のClassJ=会計年度 監視サマリ
    if (DEBUG色45173J) {
      console.log("[色DBG45173] ClassJ=会計年度 集計 全=", 色集計45173J.全,
                  " 一致=", 色集計45173J.一致,
                  " 不一致=", 色集計45173J.不一致,
                  " 空=", 色集計45173J.空);
    }
  }

  /* ========================= 起動 ========================= */

  async function Kanban起動() {
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


    // 単一iframe生成
    w.KanbanFrameSingle.初期化();

    // 3テーブル取得
    let recs1 = [], recs2 = [], recs3 = [];
    try {
      recs1 = await w.PleasanterApi.レコード取得();        // 45208
      recs2 = await w.PleasanterApi別.レコード取得();       // 45173
      recs3 = await w.PleasanterApi_121624.レコード取得();  // 121624
    } catch (e) {
      console.error("レコード取得失敗:", e);
    }
    recs1.forEach(r => r._tableId = 45208);
    recs2.forEach(r => r._tableId = 45173);
    recs3.forEach(r => r._tableId = 121624);

    const records = [...recs1, ...recs2, ...recs3];

    if (DEBUG) {
      console.log("統合レコード件数:", records.length);
      // ★過剰ログ回避のため、詳細ループ出力は削除済み
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

    // 初期の左右抽出
    const s = w.Kanban設定 || {};
    const 固定右_正規 = 正規化(s?.固定右フレーム?.画像名 || 固定右名);
    const 左名_現在   = 現在の左画像名();

    const 左対象 = 左側の抽出(records, 左名_現在);
    const 右対象 = records.filter(r => 正規化(所属名(r)) === 固定右_正規);

    if (DEBUG) {
      const cnt = { 45208: 0, 45173: 0, 121624: 0 };
      records.forEach(r => { cnt[r._tableId] = (cnt[r._tableId] || 0) + 1; });
      console.log("テーブル別件数:", cnt);
      console.log(`[初期] 左(${左名_現在})=${左対象.length}, 右(${固定右名})=${右対象.length}`);
    }

    配置する(ctx, 左対象, "左");
    配置する(ctx, 右対象, "右");

    console.log("配置完了: 左=", 左対象.length, "右=", 右対象.length);

    /* ---------- 画像選択（左切替。「その他」対応） ---------- */
    w.addEventListener("kanban:imageSelected", async (ev) => {
      try {
        const name = ev?.detail?.name || "";
        const 固定名 = s?.固定右フレーム?.画像名 || 固定右名;

        // 左でサーバー室は無視（ガード）
        if (name === 固定名) {
          console.warn("左で『サーバー室』は選択不可のため無視しました。");
          return;
        }

        // 現在選択名を保持（必ず Kanban現在 を初期化）
        w.Kanban現在 = w.Kanban現在 || {};
        w.Kanban現在.左画像名 = name || "その他";

        // 必要に応じて再取得。ここではキャッシュをそのまま使用。
        let recs = Array.isArray(w._recordsCache) ? w._recordsCache : [];
        if (!Array.isArray(recs)) recs = [];
        w._recordsCache = recs;

        const 左抽出 = 左側の抽出(recs, w.Kanban現在.左画像名);
        const 右抽出 = recs.filter(r => 正規化(所属名(r)) === 正規化(固定名));

        if (DEBUG) {
          console.log(`[再選択] 左(${w.Kanban現在.左画像名})=${左抽出.length}, 右(${固定名})=${右抽出.length}`);
        }

        // 既存ラベルをクリアしてから再配置
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

/* ===== 終了: kanban-bootstrap.js ===== */
