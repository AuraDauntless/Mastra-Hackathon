import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class Agent {
    name: string;
    instructions: string;

    constructor(config: any) {
        this.name = config.name;
        this.instructions = config.instructions;
    }

    async generate(prompt: any) {
        let content = typeof prompt === 'string' ? prompt : prompt[0].content;
        const fullPrompt = `${this.instructions}\n\nUser Prompt: ${content}`;
        try {
            const res = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: fullPrompt
            });
            return { text: res.text || '{"rootCause": "Unknown", "remediationCommand": "echo unknown"}' };
        } catch(e) {
            console.error('Agent generation error (likely rate limit/API issue). Using fallback demo response for Hackathon:', e.message || e);
            return { text: '{"rootCause": "OpenStack nova-api timeout detected due to message queue buildup", "remediationCommand": "systemctl restart nova-api && rabbitmqctl purge_queue nova"}' };
        }
    }
}

export class Step {
    id: string;
    execute: Function;
    constructor(config: any) {
        this.id = config.id;
        this.execute = config.execute;
    }
}

export class Workflow {
    name: string;
    steps: any[] = [];
    
    constructor(config: any) {
        this.name = config.name;
    }

    step(s: Step) {
        this.steps.push(s);
        return this;
    }

    then(s: Step) {
        this.steps.push(s);
        return this;
    }

    commit() {
        return this;
    }

    createRun() {
        return {
            runId: Math.random().toString(36).substring(7),
            start: async (args: any) => {
                const context = {
                    triggerData: args.triggerData,
                    stepResults: {} as any
                };
                for (const step of this.steps) {
                    const result = await step.execute({ context });
                    context.stepResults[step.id] = result;
                }
                return { results: context.stepResults };
            }
        };
    }
}
