(function(window) {
  "use strict";

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
      id: "test-panel",
      ラベル: "テストパネル",
      render: function(container) {
        // テスト用の簡単なHTML表示
        console.log("[TabManager] テストパネルを初期化中...");
        container.innerHTML = `
          <div style="padding: 40px; font-size: 18px; font-weight: 600; color: #333; background: #fff; border: 3px solid purple; border-radius: 8px; margin: 20px;">
            <h2 style="margin: 0 0 20px 0; color: #6a1b9a;">テストパネル</h2>
            <p style="margin: 10px 0; font-size: 16px; font-weight: 400;">タブ切り替えが正常に動作しています！</p>
            <p style="margin: 10px 0; font-size: 14px; color: #666;">このパネルには将来的にPCリストなどの機能を追加できます。</p>
          </div>
        `;
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
