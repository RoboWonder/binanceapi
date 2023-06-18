// profit.js
import { EventEmitter } from 'events';

class Profit extends EventEmitter {
    constructor() {
        super();
        this.orders = {};
    }

    onOrderUpdate(order) {
        const symbol = order.s;
        if (!this.orders[symbol]) {
            this.orders[symbol] = [];
        }

        this.orders[symbol].push(order);

        this.calculateProfit(symbol);
    }

    calculateProfit(symbol) {
        const orders = this.orders[symbol];
        let buyAmount = 0;
        let buyCost = 0;
        let sellAmount = 0;
        let sellRevenue = 0;

        for (const order of orders) {
            const quantity = parseFloat(order.q);
            const price = parseFloat(order.p);

            if (order.S === 'BUY') {
                buyAmount += quantity;
                buyCost += quantity * price;
            } else if (order.S === 'SELL') {
                sellAmount += quantity;
                sellRevenue += quantity * price;
            }
        }

        if (sellAmount > buyAmount) {
            console.error(`Sell amount for ${symbol} exceeds buy amount`);
            return;
        }

        const profit = sellRevenue - (sellAmount / buyAmount) * buyCost;
        logger.info(`Profit update for ${symbol}: ${profit}`);
        
        this.emit('profitUpdate', {
            symbol: symbol,
            profit: profit
        });

        // If all buy orders have been sold, remove the symbol from orders
        if (sellAmount === buyAmount) {
            delete this.orders[symbol];
        }
    }
}

export default Profit;
