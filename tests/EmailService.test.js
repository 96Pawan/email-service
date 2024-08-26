// tests/EmailService.test.js

const EmailService = require('../src/EmailService');
const EmailProvider = require('../src/EmailProvider');

test('EmailService retries on failure and falls back to another provider', async () => {
    const provider1 = new EmailProvider('Provider1', 1); 
    const provider2 = new EmailProvider('Provider2', 0); 

    const emailService = new EmailService([provider1, provider2]);

    const result = await emailService.sendEmail({ to: 'test@example.com', body: 'Hello' });
    
    expect(result).toBe('Email sent via Provider2');
    expect(emailService.getStatus().length).toBe(2);
});

test('EmailService handles rate limiting', async () => {
    const provider = new EmailProvider('Provider', 0);

    const emailService = new EmailService([provider]);

    for (let i = 0; i < 10; i++) {
        await emailService.sendEmail({ to: `test${i}@example.com`, body: 'Hello' });
    }

    await expect(emailService.sendEmail({ to: 'test10@example.com', body: 'Hello' }))
        .rejects.toThrow('Rate limit exceeded');
});