# IRidi XML to IRidi JSON Converter

一個用 Node.js 製作的工具，用於將 **iRidi XML 格式的 Branch 資料** 轉換成 **iRidi 可用的 JSON 格式**。  
支援多 Branch、可自動生成多個 Port、並透過命令列指定 MOD 名稱。

---

## 功能特色

- 從 `source.xml` 讀取多個 `<Branch>` 節點
- 自動解析 Data，去除前置 Header
- 轉換成 Global Cache JSON 結構
- 自動生成 3 個 Port (`Port 1-1`, `Port 2-1`, `Port 3-1`)
- 命令列參數指定 MOD 名稱
- 輸出 `export.json` 可直接匯入 Global Cache 系統

---

## 使用方式
``` 
node iRidiXmlConverter.js  MOD_NAME
```