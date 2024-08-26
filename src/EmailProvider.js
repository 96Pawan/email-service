// src/EmailProvider.js

class EmailProvider {
    constructor(name, failureRate = 0.1) {
        this.name = name;
        this.failureRate = failureRate;
    }

    async send(email) {
        return new Promise((resolve, reject) => {
            if (Math.random() < this.failureRate) {
                reject(new Error(`Failed to send email through ${this.name}`));
            } else {
                resolve(`Email sent via ${this.name}`);
            }
        });
    }
}

module.exports = EmailProvider;
