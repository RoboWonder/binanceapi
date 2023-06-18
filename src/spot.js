// spot.js
import { EventEmitter } from 'events';
import Socket from './socket.js';

class Spot extends EventEmitter {
    constructor() {
        super();
        this.socket = new Socket();
        this.socket.on('message', this.onMessage.bind(this));
        this.socket.connect();
    }

    onMessage(data) {
        const message = JSON.parse(data);
        if (message.e !== 'executionReport') {
            return;
        }

        switch (message.X) {
            case 'NEW':
                this.emit('orderNew', message);
                break;
            case 'CANCELED':
                this.emit('orderCanceled', message);
                break;
            case 'REPLACED':
                this.emit('orderReplaced', message);
                break;
            case 'REJECTED':
                this.emit('orderRejected', message);
                break;
            case 'TRADE':
                this.emit('orderTrade', message);
                break;
            case 'EXPIRED':
                this.emit('orderExpired', message);
                break;
            case 'TRADE_PREVENTION':
                this.emit('orderTradePrevention', message);
                break;
            default:
                logger.info('Received message:', message);
        
        }
    }
}

export default Spot;
