# Project Specification: Mayday Chronicle

**版本**: 1.0.0 (MVP)
**狀態**: 規劃中
**日期**: 2026-02-17

## 1. 專案概述 (Overview)

### 1.1 願景

建立一個具備「資訊系統」架構的五月天演唱會數位典藏平台。透過 Web GIS 技術，將散落在網路上的碎片化資訊（時間、地點、歌單、故事）結構化，並以「時空地圖」的形式呈現，紀錄樂團跨越數十載的飛行軌跡。

### 1.2 目標 (Objectives)

- **資料結構化**：建立可擴充的 JSON Schema，解決演唱會資料欄位不統一的問題。
- **視覺化體驗**：提供優於傳統列表式（List View）的地理視覺化體驗。
- **系統安全性**：採用純靜態網站架構 (Static Site Generator)，確保資安零風險且維護成本極低。

## 2. 專案範圍 (Scope)

### 2.1 階段一：MVP (Minimum Viable Product)

- **資料範圍**：優先建立 **「5525 回到那一天」** 巡迴演唱會資料。
- **地圖功能**：
  - 全球地圖瀏覽 (WGS-84 座標系)。
  - 深色模式圖資 (Dark Mode Tiles)。
  - 場次叢集 (Clustering)：解決單一地點多場次的顯示問題。
- **資訊呈現**：
  - 支援 RWD 的詳細資訊面板。
  - 外部連結整合 (YouTube, Google Maps, News)。
- **技術架構**：React + Leaflet + GitHub Pages。

### 2.2 階段二：未來規劃 (Out of MVP Scope)

- 收錄歷史巡迴 (如：諾亞方舟、人生無限公司、好好好想見到你)。
- 搜尋與篩選功能 (依城市、年份、歌曲)。
- 統計儀表板 (Dashboard)。
- 使用者個人化功能 (我的足跡)。我發現了一個 UI Bug：當我點擊地圖上的 Pin 點時，手機版的 Drawer 和電腦版的 Sidebar 會同時出現。

請幫我修改 App.tsx (或是包含 Layout 的檔案)，利用 Tailwind CSS 的 Breakpoints 來讓它們互斥顯示：

針對 Mobile Drawer (<Drawer.Root> 或其外層容器)：

請加上 class md:hidden。

這會確保它只在手機版畫面 (< 768px) 出現，電腦版會自動隱藏。

針對 Desktop Sidebar (左側欄位容器)：

請加上 class hidden md:flex (如果是用 flex 排版) 或 hidden md:block。

這會確保它在手機版預設隱藏，只在電腦版畫面 (>= 768px) 出現。

檢查 Layout 結構：

確保 Sidebar 和 Map 在電腦版是 flex-row (左右並排)。

確保在手機版時，Map 是 flex-col 或佔滿全螢幕，且 Sidebar 區塊完全消失不佔空間。

## 3. 系統架構 (System Architecture)

### 3.1 技術選型

- **Frontend**: React, TypeScript, Tailwind CSS
- **Map Engine**: Leaflet (配合 `react-leaflet`)
- **State Management**: React Context API
- **Router**: React Router (或是單頁應用 SPA)

### 3.2 資料流設計

系統採用 **"Separation of Concerns"** (關注點分離) 原則設計 JSON 資料庫：

1. **Tours (主檔)**：定義巡迴主題、描述、標準歌單 (Standard Setlist)。
2. **Concerts (明細檔)**：定義個別場次的時空資訊、與標準歌單的差異 (Diff)。

## 4. 資料庫設計 (Data Schema)

### 4.1 巡迴主檔 (`tours.json`)

```typescript
interface Tour {
  id: string; // e.g., "5525_return"
  name: {
    zh: string; // "5525 回到那一天"
    en: string;
  };
  period: string; // "2023-Present"
  description: string;
  standard_setlist: {
    // 該巡迴的公版歌單
    seq: number;
    song_name: string;
    album?: string;
  }[];
}
```

### 4.2 場次明細檔 (`concerts.json`)

```typescript
interface Concert {
  id: string; // e.g., "20231231_taichung"
  tour_ref: string; // Foreign Key -> tours.id
  date: string; // ISO 8601 "YYYY-MM-DD"

  location: {
    city: string;
    venue_name: {
      current: string; // 現今名稱 (用於 Google Maps)
      historical: string; // 當年名稱 (用於顯示)
    };
    coordinates: [number, number]; // [Lat, Lng] WGS-84
    is_demolished: boolean; // 場館是否已拆除
  };

  time_info: {
    start_time?: string; // 當地時間 "HH:mm", Optional
    end_time?: string; // 當地時間 "HH:mm", Optional
    timezone: string; // e.g., "Asia/Taipei"
  };

  // 歌單變動 (僅記錄差異，節省空間)
  setlist_modifications: {
    removed_seq: number[]; // 刪除的歌曲序號
    added: {
      after_seq: number; // 在第幾首之後插入
      song_name: string;
      note?: string; // e.g., "feat. Energy"
    }[];
    encore: {
      // 安可曲 (獨立結構)
      song_name: string;
    }[];
  };

  links: {
    youtube_playlist?: string;
    news_reports?: { title: string; url: string }[];
  };
}
```

## 5. UI/UX 設計規範

### 5.1 佈局策略 (Layout)

- **Desktop (寬螢幕)**：
  - **左側 (Sidebar)**：巡迴列表與年份篩選器。
  - **中間 (Map)**：滿版地圖。
  - **右側 (Overlay)**：點擊 Marker 後滑出詳細資訊卡。
- **Mobile (手機直式)**：
  - **全螢幕地圖**：移除干擾元素。
  - **底部抽屜 (Bottom Sheet)**：
    - `Collapsed` (預設)：顯示場次摘要 (日期、地點)。
    - `Expanded` (上滑)：顯示完整歌單與故事。

### 5.2 視覺風格

- **色系**：深色模式 (Dark Mode) 為主。
- **主色**：`#0096FF` (Mayday Blue) 用於互動元件。
- **圖資**：使用 CartoDB Dark Matter 或類似的高對比深色地圖。

## 6. 開發里程碑 (Roadmap)

| 階段                    | 預計時間 | 任務重點                                           |
| :---------------------- | :------- | :------------------------------------------------- |
| **Phase 1: Setup**      | Week 1   | 專案初始化、Tailwind 設定、建立 JSON 假資料。      |
| **Phase 2: Core Map**   | Week 2   | Leaflet 整合、深色地圖實作、解決中國地圖偏移問題。 |
| **Phase 3: UI Impl**    | Week 3   | 開發 RWD 介面、Bottom Drawer 元件、歌單列表視圖。  |
| **Phase 4: Data Entry** | Week 4   | 輸入「5525 回到那一天」巡迴資料、外部連結測試。    |
| **Phase 5: Release**    | Week 5   | 部署至 GitHub Pages、編寫使用文件。                |

## 7. 風險管理 (Risk Management)

- **R1: 外部連結失效 (Link Rot)**
  - **對策**：僅儲存連結網址，不依賴連結內容進行渲染。於 UI 標示「外部連結」。
- **R2: 舊場次資料缺失**
  - **對策**：資料欄位設為 Optional (可選)，UI 設計需能適應「資料空白」的狀況 (Graceful Degradation)。
- **R3: 效能問題**
  - **對策**：MVP 階段資料量小；未來若資料膨脹，改採動態載入 (Lazy Loading) JSON。
