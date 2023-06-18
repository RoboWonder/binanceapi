// utils.js
import https from 'https';
import { config } from './config.js';
import logger from './logger.js';

export function sendTelegramMessage(text) {
    const data = JSON.stringify({
        chat_id: config.telegram.chatId,
        text: text
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${config.telegram.botToken}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            logger.info(`Received response from Telegram: ${body}`);
        });
    });

    req.on('error', error => {
        logger.error(`Error in sending Telegram message: ${error}`);
    });

    req.write(data);
    req.end();
}
