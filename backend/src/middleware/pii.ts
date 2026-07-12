import { Request, Response, NextFunction } from 'express';

// Regex for masking PII
const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const usernameRegex = /(?:user|username)[:=]\s*([a-zA-Z0-9_-]+)/gi;

export const maskPII = (log: string): string => {
    if (!log) return log;
    let masked = log.replace(ipRegex, '[REDACTED_IP]');
    masked = masked.replace(emailRegex, '[REDACTED_EMAIL]');
    masked = masked.replace(usernameRegex, 'user=[REDACTED_USER]');
    return masked;
};

export const piiMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
        const stringified = JSON.stringify(req.body);
        const maskedString = maskPII(stringified);
        req.body = JSON.parse(maskedString);
    }
    next();
};
