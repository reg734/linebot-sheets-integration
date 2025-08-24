# LINE Bot Google Sheets 整合

這是一個 LINE Bot 應用程式，可以將用戶傳送的訊息自動儲存到 Google Sheets。

## 功能

- 接收 LINE 用戶的文字訊息
- 將訊息內容、用戶 ID、時間戳記儲存到 Google Sheets
- 回覆確認訊息給用戶

## 設定步驟

### 1. LINE Bot 設定

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 創建新的 Provider 和 Channel
3. 記錄以下資訊：
   - Channel Access Token
   - Channel Secret

### 2. Google Sheets API 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用 Google Sheets API
4. 創建服務帳戶：
   - 進入「憑證」頁面
   - 點擊「創建憑證」→「服務帳戶」
   - 填寫服務帳戶名稱
   - 下載 JSON 金鑰檔案
5. 創建 Google Sheets：
   - 創建新的 Google Sheets
   - 記錄 Sheet ID（在 URL 中：`https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`）
   - 將服務帳戶的 email（在 JSON 金鑰中的 `client_email`）加入為 Sheet 的編輯者

### 3. 環境變數設定

複製 `.env.example` 為 `.env` 並填入以下資訊：

```env
LINE_CHANNEL_ACCESS_TOKEN=你的_LINE_Channel_Access_Token
LINE_CHANNEL_SECRET=你的_LINE_Channel_Secret
GOOGLE_SHEET_ID=你的_Google_Sheet_ID
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account"...} # 完整的 JSON 金鑰內容
```

## 本地開發

1. 安裝相依套件：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 使用 ngrok 建立公開 URL：
```bash
ngrok http 3000
```

4. 在 LINE Developers Console 設定 Webhook URL：
   - URL: `https://你的-ngrok-url.ngrok.io/webhook`
   - 啟用 Webhook

## 部署到 Zeabur

### 方法一：使用 GitHub 整合

1. 將程式碼推送到 GitHub
2. 登入 [Zeabur](https://zeabur.com/)
3. 創建新專案
4. 選擇「Deploy from GitHub」
5. 選擇你的 repository
6. 在環境變數設定中添加：
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_KEY`（將整個 JSON 內容貼上）

### 方法二：使用 Zeabur CLI

1. 安裝 Zeabur CLI：
```bash
npm install -g @zeabur/cli
```

2. 登入 Zeabur：
```bash
zeabur auth login
```

3. 部署專案：
```bash
zeabur deploy
```

4. 在 Zeabur 控制台設定環境變數

### 設定 LINE Webhook

部署完成後，在 LINE Developers Console 設定 Webhook URL：
- URL: `https://你的專案名稱.zeabur.app/webhook`
- 確保 Webhook 已啟用

## Google Sheets 資料格式

資料會儲存在 Sheet1，格式如下：

| 欄位 A | 欄位 B | 欄位 C |
|--------|--------|--------|
| 時間戳記 | 用戶 ID | 訊息內容 |

## 測試

1. 加入你的 LINE Bot 為好友
2. 傳送任意文字訊息
3. Bot 會回覆確認訊息
4. 檢查 Google Sheets 是否有新增資料

## 疑難排解

### Bot 沒有回應
- 檢查 Webhook URL 是否正確
- 確認環境變數都已正確設定
- 查看 Zeabur 的 Log 是否有錯誤訊息

### Google Sheets 沒有資料
- 確認服務帳戶已加入為 Sheet 的編輯者
- 檢查 `GOOGLE_SERVICE_ACCOUNT_KEY` 格式是否正確
- 確認 Sheet ID 正確

### 部署失敗
- 確認 Node.js 版本 >= 18
- 檢查所有環境變數是否已設定
- 查看 Zeabur 的建置日誌

## 授權

MIT