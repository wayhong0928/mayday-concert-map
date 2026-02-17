# Mayday Chronicle | 五月天世界巡演編年史

> 一個基於時空數據的互動式地圖，紀錄五月天成軍以來飛越世界的軌跡與藍色回憶。

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Tech Stack](https://img.shields.io/badge/Built%20With-React%20%7C%20TypeScript%20%7C%20Leaflet-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 專案簡介 (Introduction)

**Mayday Chronicle** 是一個純前端的開源 Side Project。本專案運用地理資訊系統 (GIS) 與現代化 Web 技術，將五月天歷年巡迴演唱會的數據視覺化。

透過互動式地球儀與時間軸，使用者可以探索每一場演唱會的時空背景。從早期的校園巡演到最新的「回到那一天」，我們試圖在數位世界中重建那片藍色螢光海。

**核心理念**：

- **時空敘事**：結合地理位置 (Location) 與時間維度 (Time) 的沈浸式瀏覽體驗。
- **行動優先**：針對手機操作優化的 RWD 介面，採用底部抽屜 (Bottom Sheet) 設計。
- **開源協作**：資料結構化儲存於 JSON，便於社群維護與擴充。

## 🚀 功能特色 (Features - MVP)

- **互動式深色地圖**：採用 OpenStreetMap 與 Dark Matter 風格圖資，重現演唱會氛圍。
- **巡演軌跡叢集 (Clustering)**：智慧聚合同一城市的多場次數據，保持地圖視野清晰。
- **5525 回到那一天**：首波收錄 25 週年巡迴的完整場次資訊。
- **詳細資訊抽屜**：查看該場次的歌單變動、歷史場館資訊與外部影音連結。
- **響應式設計**：支援 Desktop 儀表板模式與 Mobile 全螢幕地圖模式。

## 🛠️ 技術堆疊 (Tech Stack)

- **核心框架**：React 18 + TypeScript (Vite)
- **地圖引擎**：Leaflet + React-Leaflet
- **樣式管理**：Tailwind CSS
- **UI 組件**：Headless UI + Vaul (Drawer)
- **部署平台**：GitHub Pages (CI/CD via GitHub Actions)
- **資料來源**：Static JSON (No Database)

## 📦 安裝與執行 (Getting Started)

### 前置需求

- Node.js (v18+)
- npm 或 yarn

### 開發步驟

1. **Clone 專案**

    ```bash
    git clone [https://github.com/your-username/mayday-chronicle.git](https://github.com/your-username/mayday-chronicle.git)
    cd mayday-chronicle
    ```

2. **安裝依賴**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **啟動開發伺服器**

    ```bash
    npm run dev
    ```

4. **建置生產版本**

    ```bash
    npm run build
    ```

## 📂 專案結構 (Project Structure)

```text
mayday-chronicle/
├── public/
│   └── data/              # 靜態資料庫
│       ├── tours.json     # 巡迴主檔 (定義主題與標準歌單)
│       └── concerts.json  # 場次明細 (定義時間地點與變動)
├── src/
│   ├── components/        # React 組件 (Map, Drawer, Timeline)
│   ├── hooks/             # Custom Hooks
│   ├── types/             # TypeScript 定義 (Schema)
│   └── utils/             # 工具函式 (座標轉換, 日期格式化)
├── SPEC.md                # 專案規格說明書
└── README.md              # 專案說明文件
```

## ⚠️ 免責聲明 (Disclaimer)

1. **非官方專案**：本專案為粉絲自發製作，與相信音樂或五月天官方無任何商業關聯。
2. **版權聲明**：網站內引用的外部連結（YouTube 影片、新聞報導）版權歸原創作者所有。本站僅提供索引連結，不儲存任何影音檔案。
3. **資料準確性**：歷史資料可能存在誤差，歡迎透過 Issue 回報修正。

## 📄 授權 (License)

本專案採用 [MIT License](LICENSE)。
