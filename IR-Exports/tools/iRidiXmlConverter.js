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
const HEADER_LENGTH = 25;
const PORT_INDEXES = [1, 2, 3];

// =======================
// 讀取 XML
// =======================
const xmlContent = fs.readFileSync(SOURCE_XML, "utf8");

// 嚴格抓 Branch Name + Data
const branchRegex =
    /<Branch\b[^>]*\bName="([^"]+)"[^>]*\bData="([^"]+)"[^>]*\/?>/g;

// =======================
// 解析 Branch（只做一次）
// =======================
const parsedBranches = [];
let match;

while ((match = branchRegex.exec(xmlContent)) !== null) {
    const branchName = match[1];
    const dataAttr = match[2];

    const convertedData = dataAttr
        .split(",")
        .slice(HEADER_LENGTH)
        .map(h => String.fromCharCode(parseInt(h, 16)))
        .join("")
        .split(",")
        .map(v => v.trim())
        .join(",");

    parsedBranches.push({
        name: MOD_NAME + "_" + branchName + " 1",
        data: convertedData
    });
}

// =======================
// 建立 RootFolder（Port 1~3）
// =======================
const rootFolders = PORT_INDEXES.map(index => ({
    Name: `${MOD_NAME} Port ${index} - 1`,
    Items: parsedBranches.map(b => ({
        Direction: 1,
        Name: b.name,
        Params: {
            Data: `'sendir,1:${index},1,38000,1,1,${b.data}',13`
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

console.log("✅ export.json 產生完成（完整 Devices 結構）");
