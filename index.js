const express = require('express');
const line = require('@line/bot-sdk');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        await handleMessage(event);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function handleMessage(event) {
  const { replyToken, message, source, timestamp } = event;
  const userId = source.userId || 'unknown';
  const userMessage = message.text;
  const date = new Date(timestamp);
  
  try {
    await appendToSheet([
      date.toISOString(),
      userId,
      userMessage
    ]);
    
    await client.replyMessage(replyToken, {
      type: 'text',
      text: `已將您的訊息儲存：「${userMessage}」`
    });
  } catch (error) {
    console.error('Error handling message:', error);
    
    await client.replyMessage(replyToken, {
      type: 'text',
      text: '抱歉，儲存訊息時發生錯誤。'
    });
  }
}

async function appendToSheet(values) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = 'Sheet1!A:C';
  
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [values],
    },
  });
}

app.get('/', (req, res) => {
  res.json({ 
    status: 'LINE Bot is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`LINE Bot server is running on port ${port}`);
});