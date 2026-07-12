import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
import { generateEmbedding } from '../mastra/embeddings';
dotenv.config();

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
});

export const seedQdrant = async () => {
    try {
        const collections = await qdrant.getCollections();
        if (!collections.collections.find(c => c.name === 'incidents')) {
            await qdrant.createCollection('incidents', {
                vectors: { size: 768, distance: 'Cosine' }
            });
            console.log('Created Qdrant collection: incidents');

            // Seed a mock historical incident
            const text = "OpenStack Compute node failure due to high CPU load";
            const vector = await generateEmbedding(text);
            await qdrant.upsert('incidents', {
                wait: true,
                points: [{
                    id: 1,
                    vector,
                    payload: {
                        incident_type: "CPU_SPIKE",
                        root_cause: "Zombie processes in nova-compute",
                        remediation: "systemctl restart nova-compute"
                    }
                }]
            });
            console.log('Seeded mock incident into Qdrant');
        }
    } catch(e) {
        console.log('[WARN] Skipping Qdrant seed (Database unreachable or bad credentials). Mocking response for demo.');
    }
};

export const searchSimilarIncidents = async (queryText: string) => {
    try {
        const vector = await generateEmbedding(queryText);
        const results = await qdrant.search('incidents', {
            vector: vector,
            limit: 3,
            with_payload: true
        });
        return results;
    } catch (e) {
        console.error('[WARN] Qdrant Search Error (Using mock historical data instead):', e.message);
        return [{ 
            payload: { 
                incident_type: "CPU_SPIKE", 
                root_cause: "Zombie processes", 
                remediation: "systemctl restart nova-compute" 
            } 
        }];
    }
};
