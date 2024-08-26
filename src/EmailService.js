// src/EmailService.js

const EmailProvider = require('./EmailProvider');
const RateLimiter = require('./RateLimiter');


class EmailService {
    constructor(providers) {
        this.providers = providers;
        this.currentProviderIndex = 0;
        this.status = [];
        this.maxRetries = 3;
        this.retryDelay = 1000; 
        this.rateLimiter = new RateLimiter(10, 60000); 
    }


    async sendEmail(email) {
        let attempt = 0;
        let success = false;
    
        while (attempt < this.maxRetries && !success) {
            try {
                if (this.rateLimiter.isRateLimited()) {
                    throw new Error('Rate limit exceeded');
                }
    
                const provider = this.providers[this.currentProviderIndex];
                const result = await provider.send(email);
    
                this.status.push({ email, provider: provider.name, status: 'success', attempt });
                success = true;
    
                return result;
            } catch (error) {
                if (error.message === 'Rate limit exceeded') {
                    throw error;  
                }
                this.status.push({ email, provider: this.providers[this.currentProviderIndex].name, status: 'failure', error: error.message, attempt });
                
                if (attempt < this.maxRetries - 1) {
                    await this.delay(this.retryDelay * Math.pow(2, attempt));
                }
                attempt++;
                this.switchProvider();
            }
        }
    
        throw new Error('Failed to send email after retries');
    }

    switchProvider() {
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getStatus() {
        return this.status;
    }
}

module.exports = EmailService;
