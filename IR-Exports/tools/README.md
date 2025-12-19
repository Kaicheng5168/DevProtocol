# IRidi XML to IRidi JSON Converter

一個用 Node.js 製作的工具，用於將 **iRidi XML 或 BitWise XML** 資料轉換成 **iRidi 可用的 JSON 格式**。  
支援多 Branch / Key，自動生成多個 Port，並透過命令列指定 MOD 名稱。  


---

## 功能特色

- 同時支援兩種 XML 格式：
  1. **iRidi XML (`<Branch>` 節點)**  
     - 解析 Branch 資料，去除前置 Header
     - 取得 Name 資料，作為每個 Key 的名稱
  2. **BitWise XML (`<KEY>` + `<DECODE>` 節點)**  
     - 解析 `<DECODE>` 資料，去除前 4 個值，將 hex 轉成 dec  
     - 取得 `<NAME><![CDATA[]]></NAME>` 作為每個 Key 的名稱  
- 轉換成 iRidi 可支援的 Global Cache 結構
- 自動生成 3 個 Port (`Port 1-1`, `Port 2-1`, `Port 3-1`)
- 命令列參數指定 MOD 名稱
- 輸出 `export.json` 可直接匯入 iRidi 系統

---

## 使用方式
``` 
node iRidiXmlConverter.js  MOD_NAME
```

``` 
node BitWiseXmlConverter.js MOD_NAME
```