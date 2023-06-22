// config.js
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    binance: {
        apiKey: process.env.BINANCE_API_KEY,
        secretKey: process.env.BINANCE_SECRET_KEY,
        baseUrl: process.env.BINANCE_BASE_URL
    },
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
    }
};
