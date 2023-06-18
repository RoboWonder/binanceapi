// https.js
import https from 'https';
import { config } from './config.js';
import crypto from 'crypto';

class Https {
    constructor() {
        this.baseUrl = config.binance.baseUrl;
        this.apiKey = config.binance.apiKey;
        this.secretKey = config.binance.secretKey;
    }

    getSignature(queryString) {
        return crypto
            .createHmac('sha256', this.secretKey)
            .update(queryString)
            .digest('hex');
    }

    request(method, path, data = '', needSigned = false) {
        return new Promise((resolve, reject) => {
            let options = {
                hostname: this.baseUrl,
                port: 443,
                path: path,
                method: method,
                headers: {
                    'X-MBX-APIKEY': this.apiKey,
                    'Content-Type': 'application/json',
                    'Content-Length': data ? data.length : 0
                }
            };

            if (needSigned) {
                const signature = this.getSignature(data);
                options.path += `?${data}&signature=${signature}`;
            }

            const req = https.request(options, res => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    logger.info(`Received response from ${method} ${path}: ${body}`);
                    resolve(JSON.parse(body))
                });
            });

            req.on('error', error => {
                logger.error(`Error in ${method} ${path}: ${error}`);
                reject(error)
            });

            if (data) {
                req.write(data);
            }

            req.end();
        });
    }

    get(path, needSigned = false) {
        return this.request('GET', path, '', needSigned);
    }

    post(path, data, needSigned = false) {
        return this.request('POST', path, data, needSigned);
    }

    put(path, data, needSigned = false) {
        return this.request('PUT', path, data, needSigned);
    }

    delete(path, needSigned = false) {
        return this.request('DELETE', path, '', needSigned);
    }

    getListenKey() {
        return this.post('/api/v3/userDataStream');
    }
}

export default Https;
