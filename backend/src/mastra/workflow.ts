import { Workflow, Step } from './index';
import { incidentAgent } from './agent';
import { searchSimilarIncidents } from '../qdrant';
import { validateCommandWithEnkrypt } from '../enkrypt';

export interface IncidentPayload {
    log: string;
    timestamp: string;
}

const gatherContextStep = new Step({
    id: 'gatherContext',
    execute: async ({ context }) => {
        // Trigger data is passed when the workflow is executed
        const payload = context?.triggerData as IncidentPayload;
        const log = payload?.log || "Unknown log anomaly";
        console.log(`[Mastra Workflow] Gathering context from Qdrant for log: ${log}`);
        
        const historicalContext = await searchSimilarIncidents(log);
        return {
            log,
            historicalContext
        };
    }
});

const generatePlanStep = new Step({
    id: 'generatePlan',
    execute: async ({ context }) => {
        const data = context?.stepResults?.gatherContext;
        if (!data) throw new Error("Missing context from previous step");

        console.log(`[Mastra Workflow] Generating remediation plan via Gemini`);
        
        const prompt = `
Log Anomaly: ${data.log}
Historical Incidents Context (from Qdrant): ${JSON.stringify(data.historicalContext)}
        `;
        
        const response = await incidentAgent.generate([{ role: 'user', content: prompt }]);
        let plan;
        try {
            // Strip any markdown backticks if the LLM hallucinated them
            const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
            plan = JSON.parse(cleanText);
        } catch(e) {
            console.error("Failed to parse LLM JSON:", response.text);
            plan = { rootCause: "Parse Error", remediationCommand: "echo 'Manual Check Required'" };
        }

        console.log(`[Mastra Workflow] LLM Proposed Command: ${plan.remediationCommand}`);
        
        // Enkrypt AI Safety Gate
        const safetyCheck = await validateCommandWithEnkrypt(plan.remediationCommand);
        
        return {
            ...plan,
            safe: safetyCheck.safe,
            reason: safetyCheck.reason
        };
    }
});

export const incidentWorkflow = new Workflow({
    name: 'incident-response',
    triggerSchema: undefined // using implicit any for trigger payload
});

incidentWorkflow
    .step(gatherContextStep)
    .then(generatePlanStep)
    .commit();
