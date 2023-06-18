// socket.js
import WebSocket from 'ws';
import Https from './https.js';
import { EventEmitter } from 'events';
import logger from './logger.js';

class Socket extends EventEmitter {
    constructor() {
        super();
        this.https = new Https();
        this.ws = null;
        this.pingInterval = null;
    }

    async connect() {
        const { listenKey } = await this.https.getListenKey();
        this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${listenKey}`);

        this.ws.on('open', this.onOpen.bind(this));
        this.ws.on('message', this.onMessage.bind(this));
        this.ws.on('close', this.onClose.bind(this));
        this.ws.on('error', this.onError.bind(this));
    }

    onOpen() {
        logger.info('WebSocket connection opened');

        // Ping every 30 minutes to maintain the connection
        this.pingInterval = setInterval(() => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.ping();
            }
        }, 30 * 60 * 1000);
    }

    onMessage(data) {
        // Emit a 'message' event with the data received from the WebSocket
        logger.info('WebSocket message received:', data);
        this.emit('message', data);
    }

    onClose() {
        logger.info('WebSocket connection closed');
        
        // Clear the ping interval
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }

        // Reconnect when connection is closed
        this.connect();
    }

    onError(error) {
        logger.error('WebSocket error:', error);
    }
}

export default Socket;
