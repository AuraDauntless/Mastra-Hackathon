# 🛡️ Dauntless Ops - Project Architecture & Overview

**Dauntless Ops** is an enterprise-grade, AI-driven Incident Response platform. It acts as an autonomous Site Reliability Engineer (SRE) that monitors live server telemetry, detects anomalies, proposes infrastructure fixes using historical context, and enforces a strict Human-in-the-Loop (HITL) safety gate before executing any commands.

This document breaks down exactly what the project does, the technologies it utilizes, and how data flows through the architecture.

---

## 🚀 What It Does

In a traditional DevOps environment, when a server crashes, an engineer must manually parse through thousands of logs, search documentation or past incident tickets to figure out what went wrong, and then carefully write a CLI command to fix it. 

**Dauntless Ops automates this entire triage process:**
1. It listens to a live stream of server logs.
2. When an error occurs, it instantly reads the log and cross-references it with a database of *past* incidents.
3. It figures out the Root Cause and writes the exact CLI command needed to fix the server.
4. It scans that command to guarantee the AI isn't hallucinating a dangerous payload (like `rm -rf /`).
5. It presents the plan to a human operator on a beautiful dashboard. The human simply clicks **"Approve"** to resolve the incident.

---

## 🛠️ The Tech Stack (What It Utilizes)

The application is built as a modern TypeScript monorepo, strictly decoupling the AI orchestration from the frontend UI.

### Core AI & Orchestration
*   **Mastra AI:** The core orchestration framework. We use Mastra to build a "Non-Linear State Machine" (a Graph Workflow) that handles pausing the AI, waiting for human approval, and resuming.
*   **Google GenAI (Gemini 1.5):** The "Brain" of the agent. It is prompted using the highly specific **CRISPE** framework (Context, Role, Instruction, Specifics, Personality, Experiment) to synthesize the root cause and the remediation command. It is also used to generate vector embeddings (`text-embedding-004`).
*   **Qdrant Cloud (Vector DB):** The memory of the agent. It stores a history of past server incidents. When a new error happens, we use Qdrant for semantic search (RAG) to fetch similar past errors so Gemini knows how it was fixed last time.
*   **Enkrypt AI (Security Proxy):** A zero-trust security layer. It intercepts the LLM's proposed CLI command and scans it for destructive or malicious payloads before the human ever sees it.

### Infrastructure & UI
*   **Node.js / Express / WebSockets:** The high-performance backend edge. It handles live data ingestion, JWT authentication, and bi-directional real-time communication with the dashboard.
*   **Next.js & Tailwind CSS:** The frontend React framework used to build the sleek, dark-mode HITL dashboard.
*   **Zustand:** Lightweight state management for the Next.js dashboard, ensuring the UI updates instantly as WebSockets stream in, without requiring page refreshes.
*   **Loghub OpenStack Dataset:** An open-source dataset of real production server logs used to simulate the live telemetry traffic for the demo.

---

## 🏗️ The Architecture (How Data Flows)

The architecture is designed to be highly secure and observable. Here is the exact lifecycle of a single log line traveling through the system:

### Phase 1: Ingestion & Compliance
1. **The Simulator:** A background script reads the `OpenStack` dataset and pumps logs into our backend via a WebSocket every 5 seconds.
2. **PII Masking (GDPR):** As soon as the backend receives the log, a custom Regex middleware instantly strips out IP addresses, emails, and sensitive user data (replacing them with `[REDACTED_IP]`). *No sensitive customer data is ever sent to the LLM.*

### Phase 2: The Mastra Workflow (AI Generation)
3. **Semantic Retrieval:** The masked log enters the Mastra Workflow. The system embeds the log text into a vector and queries **Qdrant** to retrieve the 3 most similar historical incidents.
4. **Synthesis:** The Mastra Agent feeds the masked log and the Qdrant history to **Gemini**. Gemini outputs a structured JSON plan containing the `rootCause` and `remediationCommand`.

### Phase 3: Zero-Trust & HITL
5. **Safety Check:** The workflow passes the `remediationCommand` to **Enkrypt AI**. Enkrypt verifies that the command is safe to run on production servers.
6. **Workflow Suspension:** The Mastra workflow enters a paused state. The backend broadcasts the proposed, validated plan to the **Next.js Dashboard** via WebSocket.
7. **Human Approval:** The operator reviews the live telemetry, reads the root cause, and checks the Enkrypt safety status on the dashboard. They click **Approve & Execute**.
8. **Resolution:** A JWT-secured REST request is fired back to the server. The Mastra workflow resumes, logs a post-mortem of the incident, and resolves the loop.

> [!TIP]
> **For the Judges:** The most innovative parts of this architecture are the **PII Masking at the Edge** (preventing data leaks before LLM ingestion) and the **Mastra State Machine** (which elegantly handles the complex suspend/resume logic required for a true Human-in-the-Loop system).
