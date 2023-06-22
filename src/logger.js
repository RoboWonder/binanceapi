// logger.js
import winston from 'winston';
import TelegramLogger from 'winston-telegram';

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
else{
    logger.add(new TelegramLogger({
        token: process.env.TELEGRAM_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID,
    }))
}

export default logger;
