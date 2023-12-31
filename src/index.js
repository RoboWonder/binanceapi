// index.js
import Spot from './spot.js';
import Profit from './profit.js';
import { sendTelegramMessage } from './utils.js';

const spot = new Spot();
const profit = new Profit();

function formatOrder(order) {
    return `
        Order Update:
        Symbol: ${order.s}
        Side: ${order.S}
        Type: ${order.o}
        Quantity: ${order.q}
        Price: ${order.p}
        Status: ${order.X}
    `;
}
function formatProfitUpdate(profitUpdate) {
    return `
Profit Update:
Symbol: ${profitUpdate.symbol}
Profit: ${profitUpdate.profit.toFixed(2)}
`;
}

sendTelegramMessage('-- BOT STARTED --');

spot.on('orderNew', (order) => {
    // profit.onOrderUpdate(order);
    sendTelegramMessage(formatOrder(order));
});
spot.on('orderNew', (order) => {
    // profit.onOrderUpdate(order);
    sendTelegramMessage(formatOrder(order));
});

spot.on('orderCanceled', (order) => {
    // profit.onOrderUpdate(order);
    sendTelegramMessage(formatOrder(order));
});

spot.on('orderRejected', (order) => {
    // profit.onOrderUpdate(order);
    sendTelegramMessage(formatOrder(order));
});

spot.on('orderTrade', (order) => {
    profit.onOrderUpdate(order);
    sendTelegramMessage(formatOrder(order));
});

profit.on('profitUpdate', (e) => {
    sendTelegramMessage(formatProfitUpdate(e));
});