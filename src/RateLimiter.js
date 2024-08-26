// src/RateLimiter.js

class RateLimiter {
    constructor(limit, interval) {
        this.limit = limit;
        this.interval = interval;
        this.timestamps = [];
    }

    isRateLimited() {
        const now = Date.now();
        this.timestamps = this.timestamps.filter(ts => now - ts < this.interval);

        if (this.timestamps.length >= this.limit) {
            return true;
        }

        this.timestamps.push(now);
        return false;
    }
}

module.exports = RateLimiter;
