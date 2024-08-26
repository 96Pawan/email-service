// tests/RateLimiter.test.js

const RateLimiter = require('../src/RateLimiter');

test('RateLimiter correctly limits the rate', () => {
    const limiter = new RateLimiter(2, 1000); 
    expect(limiter.isRateLimited()).toBe(false);
    expect(limiter.isRateLimited()).toBe(false);
    expect(limiter.isRateLimited()).toBe(true);
});

test('RateLimiter resets after the interval', (done) => {
    const limiter = new RateLimiter(1, 100); 
    expect(limiter.isRateLimited()).toBe(false);
    expect(limiter.isRateLimited()).toBe(true);

    setTimeout(() => {
        expect(limiter.isRateLimited()).toBe(false);
        done();
    }, 150); 
});
