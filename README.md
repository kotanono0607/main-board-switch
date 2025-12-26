# Kanban Board System - コード分析ドキュメント

> 最終更新: 2025-12-26

## 概要
このプロジェクトは、Pleasanter（オープンソースのプロジェクト管理システム）のデータを使用したカンバンボードシステムです。
3つのテーブル（45208, 45173, 121624）からデータを取得し、ドラッグ&ドロップ可能なラベルとして視覚的に配置・管理します。

## システム構成

### 1. 設定ファイル

#### kanban-config.js
**役割**: システム全体の設定を管理

**主要機能**:
- 画像URL、座標保存フィールド名の定義
- 左右パネルのフレーム配置設定
- 画像候補リスト（23の部署・課）
- 右側固定パネル（サーバー室）の設定
- ClassCごとの色分け設定（個人番号利用事務、LGWAN、インターネット接続の3セグメント）

**重要な設定値**:
- `最大初期ラベル件数: 600`
- `フィールド名_X: "NumX"`, `フィールド名_Y: "NumY"` - 左パネル座標
- `フィールド名_X右: "NumX2"`, `フィールド名_Y右: "NumY2"` - 右パネル座標
- `固定右フレーム.画像名: "サーバー室"` - 右側は常にサーバー室を表示

### 2. コアシステム

#### kanban-bootstrap.js
**役割**: システムの起動・初期化とレコード配置

**主要機能**:
- 3テーブル（45208, 45173, 121624）からレコードを取得
- テーブルごとの所属判定キー管理:
  - 45208 → ClassO
  - 45173 → ClassA
  - 121624 → ClassB
- ラベル表示名の決定:
  - 45173, 121624 → ClassC を使用
  - 45208 → Title/ItemTitle/Name等のフォールバック
- NFKC正規化による全角/半角の差異吸収
- 左右パネルへのラベル配置
- ClassCベースの色分け（個人番号利用事務、LGWAN、インターネット接続）
- 45173テーブル専用: ClassJ="会計年度"の場合、薄い赤色を適用
- 画像選択イベント（kanban:imageSelected）による再抽出・再配置

**デバッグモード**:
- `DEBUG`: 全体デバッグ（既定false）
- `DEBUG色`: 色分けデバッグ（既定true）
- `DEBUG色45173J`: 45173のClassJ=会計年度監視（既定true）

#### kanban-frame-single.js
**役割**: UIフレーム生成と統計表示

**主要機能**:
- 単一iframeによる左右2パネル構造の生成
- 上段帯（ステータスバー）の生成と更新:
  - 左パネル: 所属名、総数、内訳（PC台数/職員数/その他）
  - 右パネル: サーバー室のPC台数
- 所属ごとの内訳集計（3テーブル統合）
- `_recordsCache` の変化監視による自動再描画（500ms間隔、最大60秒）
- ラベル見た目の上書き（CSS + 記号クリーナ）:
  - フォントサイズ: 13px（1.5倍）
  - 先頭の「・」と末尾の「×」を非表示
- 詳細なデバッグログ出力（console.group/table/time）

**統計表示形式**:
```
所属名：◯◯　総数：n件　（PC台数: x件 / 職員数: y件 / その他: z件）
```

#### kanban-labels-single.js
**役割**: ラベルの生成とドラッグ&ドロップ機能

**主要機能**:
- ドラッグ可能なラベルの生成
- 座標ポップアップ表示（ドラッグ中）
- ドロップ先エリア判定（左/右/外）
- カスタムイベント発火:
  - `kanban:dragstart` - ドラッグ開始
  - `kanban:drop` - ドロップ完了（id, x, y, area等を通知）
- ラベルダブルクリックで Pleasanter レコード画面を開く
  - URL: `http://gwsv.nanyo-ad.ad.nanyo/items/{id}`
- 背景色・枠線色のカスタマイズ対応

#### kanban-menu.js
**役割**: 画像選択メニューの生成

**主要機能**:
- 左側パネル用の画像選択メニュー表示
- 「サーバー室」は選択肢から除外（右側固定のため）
- localStorage による選択状態の保存・復元
  - キー: `kanban.selectedImageUrl`
- 画像選択時に `kanban:imageSelected` イベント発火
- アクティブボタンのハイライト表示

### 3. データ取得API

#### pleasanter-api.js
**役割**: テーブル 45208 からレコード全件取得

**主要機能**:
- ページング対応の全件取得
- Offset を使用した順次取得（最大2000ページ）
- エラーハンドリング（HTTP/アプリケーションエラー）
- 古いブラウザ対応（?. と ?? 不使用）
- グローバル公開: `window.PleasanterApi`

**API設定**:
- URL: `http://gwsv.nanyo-ad.ad.nanyo/api/items/45208/get`
- テーブルID: 45208（PC台帳）

#### pleasanter-api2.js
**役割**: テーブル 45173 からレコード全件取得

**主要機能**:
- pleasanter-api.js と同様の全件取得機能
- グローバル公開: `window.PleasanterApi別`
- キャッシュ: `window._recordsCache_45173`
- 自動実行機能（DOMContentLoaded後に自動取得）

**API設定**:
- テーブルID: 45173（職員数）

#### pleasanter-api3.js
**役割**: テーブル 121624 からレコード全件取得

**主要機能**:
- pleasanter-api.js と同様の全件取得機能
- グローバル公開: `window.PleasanterApi_121624`
- キャッシュ: `window._recordsCache_121624`
- 自動実行機能（DOMContentLoaded後に自動取得）

**API設定**:
- テーブルID: 121624（その他）

#### pleasanter-update-api.js
**役割**: Pleasanter レコードの更新

**主要機能**:
- レコード更新API（絶対URL対応）
- Revision の自動補完（キャッシュから取得）
- NumHash 更新ユーティリティ
- グローバル公開: `window.PleasanterUpdateApi`

**公開メソッド**:
- `レコード更新(id, updates)` - レコード更新
- `ハッシュ更新(src, key, value)` - ハッシュオブジェクト更新

### 4. イベントハンドラ

#### kanban-drop-save.js
**役割**: ドラッグ&ドロップ時の座標保存

**主要機能**:
- `kanban:drop` イベントをリスン
- レイヤ座標からパネル相対座標への変換
- 左右パネルに応じた座標キーの選択:
  - 左: NumX, NumY
  - 右: NumX2, NumY2
- NumHash または直下フィールドへの保存
- 画面キャッシュ（`_recordsCache`）の自動更新
- Revision の自動インクリメント

**座標保存モード**:
- `書込キー直下: false` → NumHash に保存（既定）
- `書込キー直下: true` → 直下フィールドに保存

### 5. ローダー

#### メイン.txt
**役割**: スクリプトの順次ロード

**主要機能**:
- 9つのスクリプトを順次読み込み
- 各スクリプトの読み込み完了をコンソールログ
- 全読み込み完了後に `window.Kanban起動()` を実行
- エラー時も処理継続（次のスクリプトへ）

**ロード順序**:
1. kanban-config.js
2. kanban-frame-single.js
3. kanban-labels-single.js
4. pleasanter-api.js
5. pleasanter-update-api.js
6. kanban-menu.js
7. kanban-bootstrap.js
8. pleasanter-api2.js
9. pleasanter-api3.js
10. kanban-drop-save.js（最後のURL、ファイル名不明）

## データフロー

```
1. ページ読み込み
   ↓
2. メイン.txt がスクリプトを順次ロード
   ↓
3. kanban-config.js で設定初期化
   ↓
4. kanban-frame-single.js でUIフレーム生成
   ↓
5. pleasanter-api.js/2/3 がデータ取得
   ↓
6. kanban-bootstrap.js が起動（Kanban起動）
   ↓
7. 3テーブルのレコードを統合（_recordsCache）
   ↓
8. 左右パネルにラベル配置
   ↓
9. ユーザーがラベルをドラッグ
   ↓
10. kanban-drop-save.js が座標保存
    ↓
11. pleasanter-update-api.js でサーバー更新
```

## カスタムイベント

| イベント名 | 発火元 | 用途 | データ |
|----------|--------|------|--------|
| `kanban:imageSelected` | kanban-menu.js | 画像選択時 | `{name, url}` |
| `kanban:dragstart` | kanban-labels-single.js | ドラッグ開始 | `{el}` |
| `kanban:drop` | kanban-labels-single.js | ドロップ完了 | `{id, x, y, area, clientX, clientY, elLeft, elTop, elWidth, elHeight}` |

## グローバル変数

| 変数名 | 定義元 | 用途 |
|--------|--------|------|
| `window.Kanban設定` | kanban-config.js | 全体設定 |
| `window.Kanban現在` | kanban-bootstrap.js | 現在の選択状態 |
| `window.KanbanFrameSingle` | kanban-frame-single.js | UIコンテキスト |
| `window.KanbanLabels` | kanban-labels-single.js | ラベル生成API |
| `window.PleasanterApi` | pleasanter-api.js | テーブル45208 API |
| `window.PleasanterApi別` | pleasanter-api2.js | テーブル45173 API |
| `window.PleasanterApi_121624` | pleasanter-api3.js | テーブル121624 API |
| `window.PleasanterUpdateApi` | pleasanter-update-api.js | 更新API |
| `window._recordsCache` | kanban-bootstrap.js | 統合レコードキャッシュ |
| `window._recordsCache_45173` | pleasanter-api2.js | テーブル45173キャッシュ |
| `window._recordsCache_121624` | pleasanter-api3.js | テーブル121624キャッシュ |

## テーブル構造

### テーブル 45208（PC台帳）
- **所属判定**: ClassO（ClassHash内優先、なければ直下）
- **ラベル名**: Title/ItemTitle/Name/Subject/TitleA/DescriptionA
- **座標**: NumX, NumY（左）/ NumX2, NumY2（右）

### テーブル 45173（職員数）
- **所属判定**: ClassA（ClassHash内優先、なければ直下）
- **ラベル名**: ClassC（ClassHash内）
- **座標**: NumX, NumY（左）/ NumX2, NumY2（右）
- **特別処理**: ClassJ="会計年度" の場合、薄い赤色（#ffe5e5）適用

### テーブル 121624（その他）
- **所属判定**: ClassB（ClassHash内優先、なければ直下）
- **ラベル名**: ClassC（ClassHash内）
- **座標**: NumX, NumY（左）/ NumX2, NumY2（右）

## 色分けルール

### 基本ルール（ClassC ベース）
| ClassC値 | 背景色 | 枠線色 |
|---------|--------|--------|
| 個人番号利用事務セグメント | #ffe5e5 | #f5aaaa |
| LGWANセグメント | #e6f0ff | #99bbee |
| インターネット接続セグメント | #e8f7e8 | #88cc88 |

### 特別ルール
- **45173テーブル**: ClassJ="会計年度" の場合、ClassCに関係なく薄い赤色（#ffe5e5 / #f5aaaa）を適用

## 主要な処理フロー

### 起動処理（kanban-bootstrap.js）
1. 依存スクリプトの確認
2. 前回の左画像選択をリセット
3. フレーム初期化（KanbanFrameSingle.初期化）
4. 3テーブルからレコード取得
5. 各レコードに _tableId を付与
6. レコード統合（_recordsCache）
7. フレーム準備待ち
8. 左右の抽出・配置
9. 画像選択イベントのリスナー登録

### 画像選択処理
1. メニューボタンクリック
2. `kanban:imageSelected` イベント発火
3. bootstrap.js がイベントを捕捉
4. Kanban現在.左画像名 を更新
5. 左側の抽出（「その他」対応）
6. 既存ラベルをクリア
7. 左右パネルに再配置

### ドラッグ&ドロップ処理
1. ユーザーがラベルをドラッグ
2. pointerdown でドラッグ開始
3. pointermove で座標更新
4. 座標ポップアップ表示
5. pointerup でドロップ
6. `kanban:drop` イベント発火
7. drop-save.js が捕捉
8. パネル相対座標に変換
9. NumHash 更新オブジェクト構築
10. PleasanterUpdateApi でサーバー更新
11. _recordsCache 更新

## セキュリティ上の注意

**APIキー**:
すべてのAPIファイルに同じAPIキーがハードコードされています：
```
f2ae46b2fd9669a23313a1230dd3b7ecc094ffc16b0798ae156d940a2be85b5395f44bac9eb20058143500a3c0d56b6c76d4f00acc842a08ff4748ab0beb2f46
```

**推奨事項**:
- 本番環境では環境変数やセキュアな設定ファイルに移行
- APIキーの定期的なローテーション
- アクセス権限の最小化

## ブラウザ互換性

- 古いブラウザ対応のため、オプショナルチェーン（?.）とnullish coalescing（??）を一部避けています
- fetch API を使用（IE11非対応）
- Pointer Events 使用（IE11は部分対応）
- MutationObserver 使用（IE11対応）

## デバッグ方法

### コンソールログ
- kanban-bootstrap.js: `DEBUG`, `DEBUG色`, `DEBUG色45173J` フラグ
- kanban-frame-single.js: `window.KanbanFrameSingleDebug = true` で詳細ログ

### 主要なログポイント
- レコード取得: 各テーブルのページング進捗
- 配置処理: 左右の件数、色分け集計
- 上段帯更新: 所属名、総数、内訳
- ドロップ保存: 座標変換、API応答

## 改善提案

### コードの最適化
1. **APIキーの外部化**: ハードコードされたAPIキーを環境変数に移行
2. **エラーハンドリングの強化**: ネットワークエラー時のリトライ処理
3. **パフォーマンス**: 大量ラベル時の仮想スクロール導入
4. **型安全性**: TypeScript化による型チェック

### 機能拡張
1. **検索・フィルタ**: ラベルの検索・絞り込み機能
2. **バッチ更新**: 複数ラベルの一括移動
3. **履歴管理**: 変更履歴の記録・undo機能
4. **エクスポート**: CSV/Excel出力機能

### UI/UX改善
1. **レスポンシブ対応**: モバイル/タブレット対応
2. **アクセシビリティ**: キーボード操作対応
3. **テーマ**: ダークモード対応
4. **通知**: 保存成功/失敗の視覚的フィードバック

## ライセンス・クレジット

- Pleasanter: オープンソースプロジェクト管理システム

## 連絡先・サポート

（組織の連絡先情報をここに記載）

