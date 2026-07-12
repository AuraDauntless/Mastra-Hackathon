import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates a remediation command using Enkrypt AI to prevent destructive actions.
 */
export const validateCommandWithEnkrypt = async (command: string): Promise<{ safe: boolean, reason?: string }> => {
    console.log(`[Enkrypt AI] Validating payload: ${command}`);
    
    // In a production environment, this would be an HTTP POST to Enkrypt AI API using ENKRYPT_API_KEY
    const dangerousKeywords = ['rm -rf', 'DROP TABLE', 'shutdown', 'format', 'killall'];
    
    for (const keyword of dangerousKeywords) {
        if (command.includes(keyword)) {
            console.warn(`[Enkrypt AI] Blocked destructive payload: ${keyword}`);
            return { safe: false, reason: `Enkrypt AI Safety Violation: Blocked destructive command containing '${keyword}'` };
        }
    }
    
    console.log(`[Enkrypt AI] Payload safe.`);
    return { safe: true };
};
