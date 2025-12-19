const fs = require("fs");
const path = require("path");

// =======================
// argv
// node test.js MOD
// =======================
const MOD_NAME = process.argv[2];

if (!MOD_NAME) {
    console.error("❌ 用法：node test.js MOD");
    process.exit(1);
}

// =======================
// 設定
// =======================
const SOURCE_XML = path.join(__dirname, "/runtime/source.xml");
const EXPORT_JSON = path.join(__dirname, "/runtime/export.json");
const PORT_INDEXES = [1, 2, 3];

// =======================
// 讀取 XML
// =======================
const xmlContent = fs.readFileSync(SOURCE_XML, "utf8");

// =======================
// 抓 KEY + NAME(CDATA) + DECODE
// =======================
const keyRegex =
    /<KEY\b[^>]*>[\s\S]*?<NAME><!\[CDATA\[(.*?)\]\]><\/NAME>[\s\S]*?<DECODE>([\s\S]*?)<\/DECODE>[\s\S]*?<\/KEY>/g;

// =======================
// 解析 KEY（只做一次）
// =======================
const parsedKeys = [];
let match;

while ((match = keyRegex.exec(xmlContent)) !== null) {
    const keyName = match[1].trim();   // CDATA 任意字串
    const decodeDataRaw = match[2].trim();

    // 防呆：如果 decodeData 為空，跳過該 KEY
    if (!decodeDataRaw) {
        console.warn(`⚠️  KEY "${keyName}" 的 DECODE 為空，已跳過`);
        continue;
    }

    const decodeData = decodeDataRaw.split(/\s+/);

    // 計算 offset = 第三個 hex * 2 + 1
    const thirdHex = parseInt(decodeData[2], 16);
    const offset = thirdHex * 2 + 1;

    // 真正的 timing 資料，去掉前 4 個
    const timingData = decodeData
        .slice(4)
        .map(v => parseInt(v, 16))
        .join(",");

    parsedKeys.push({
        name: `${MOD_NAME}_${keyName} 1`,
        offset: offset,
        data: timingData
    });
}

// =======================
// 建立 RootFolder（Port 1~3）
// =======================
const rootFolders = PORT_INDEXES.map(index => ({
    Name: `${MOD_NAME} Port ${index} - 1`,
    Items: parsedKeys.map(k => ({
        Direction: 1,
        Name: k.name,
        Params: {
            Data: `'sendir,1:${index},1,38000,1,${k.offset},${k.data}',13`
        }
    }))
}));

// =======================
// 最終輸出 JSON（Devices）
// =======================
const output = {
    Devices: [
        {
            Type: 29,
            Name: "Global Cache IR Package",
            Protocol: "TCP",
            Merge: 1,
            Connection: {
                Host: "192.168.0.100",
                Port: 4998
            },
            RootFolder: rootFolders
        }
    ]
};

// =======================
// 寫檔
// =======================
fs.writeFileSync(
    EXPORT_JSON,
    JSON.stringify(output, null, 2),
    "utf8"
);

console.log("✅ export.json 產生完成（KEY / DECODE 版本，含自動 offset 計算）");
