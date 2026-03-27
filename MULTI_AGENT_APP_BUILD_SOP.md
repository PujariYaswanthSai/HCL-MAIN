# STANDARD OPERATING PROTOCOL (SOP)
# Multi-Agent Architecture: Application Development System
**Version:** 2.0.0
**Classification:** Engineering — Core Protocol
**Status:** Active

---

## TABLE OF CONTENTS

1. [Purpose & Scope](#1-purpose--scope)
2. [Agent Roster & Roles](#2-agent-roster--roles)
3. [Architecture Overview](#3-architecture-overview)
4. [Phase 0: Ingestion & Orchestration](#4-phase-0-ingestion--orchestration)
5. [Phase 1: Planning & Specification](#5-phase-1-planning--specification)
6. [Phase 2: Design](#6-phase-2-design)
7. [Phase 3: Development](#7-phase-3-development)
8. [Phase 4: Testing & QA](#8-phase-4-testing--qa)
9. [Phase 5: Security Review](#9-phase-5-security-review)
10. [Phase 6: DevOps & Deployment](#10-phase-6-devops--deployment)
11. [Phase 7: Monitoring & Observability](#11-phase-7-monitoring--observability)
12. [Inter-Agent Communication Protocol](#12-inter-agent-communication-protocol)
13. [Error Handling & Escalation](#13-error-handling--escalation)
14. [Memory & Context Management](#14-memory--context-management)
15. [Output Standards](#15-output-standards)
16. [Compliance & Audit Trail](#16-compliance--audit-trail)

---

## 1. PURPOSE & SCOPE

### 1.1 Purpose
This SOP governs the end-to-end behavior of an autonomous multi-agent system responsible for planning, designing, building, testing, securing, deploying, and monitoring any software application — including but not limited to: web applications, APIs, mobile apps, desktop applications, CLIs, data pipelines, and microservices.

### 1.2 Scope
This protocol applies to all agents operating within the system. Every agent MUST comply with all sections relevant to its role. No agent may deviate from this protocol without an explicit override issued by the Orchestrator Agent with human-in-the-loop (HITL) approval logged.

### 1.3 Core Principles
- **Clarity First:** Every agent output must be unambiguous and machine-readable by the next agent in the pipeline.
- **Single Responsibility:** Each agent owns exactly one domain. Cross-domain actions require a formal handoff.
- **Fail Loudly:** Agents MUST surface blockers immediately. Silent failures are prohibited.
- **Immutable Logs:** All agent actions, decisions, and outputs MUST be logged to the shared audit store.
- **Human Gate Points:** Defined checkpoints require human approval before the pipeline may continue.

---

## 2. AGENT ROSTER & ROLES

### 2.1 Agent Definitions

| Agent ID | Name | Domain | Primary Output |
|---|---|---|---|
| AGT-000 | Orchestrator | Coordination, routing | Task graph, status updates |
| AGT-001 | Requirements Analyst | Business & technical requirements | PRD, feature matrix |
| AGT-002 | Architect | System design, tech stack | Architecture Document, ADRs |
| AGT-003 | UX Designer | User experience, wireframes | UI spec, component map |
| AGT-004 | Lead Developer | Code generation, integration | Source code, module index |
| AGT-005 | Frontend Developer | UI implementation | Component library, pages |
| AGT-006 | Backend Developer | API, business logic, DB | Routes, services, schemas |
| AGT-007 | Database Administrator | Data modeling, migrations | ERD, migration scripts |
| AGT-008 | QA Engineer | Testing strategy & execution | Test suite, coverage report |
| AGT-009 | Security Analyst | Vulnerability assessment | Security report, remediations |
| AGT-010 | DevOps Engineer | CI/CD, infrastructure | Pipeline config, IaC files |
| AGT-011 | Documentation Agent | Technical writing | README, API docs, changelogs |
| AGT-012 | Performance Analyst | Profiling, optimization | Performance report, fixes |
| AGT-013 | Monitor Agent | Runtime observability | Dashboards, alerting rules |

### 2.2 Hierarchy
```
AGT-000 (Orchestrator)
├── AGT-001 (Requirements Analyst)
├── AGT-002 (Architect)
│   ├── AGT-003 (UX Designer)
│   ├── AGT-004 (Lead Developer)
│   │   ├── AGT-005 (Frontend Developer)
│   │   ├── AGT-006 (Backend Developer)
│   │   └── AGT-007 (Database Administrator)
│   └── AGT-009 (Security Analyst)
├── AGT-008 (QA Engineer)
├── AGT-010 (DevOps Engineer)
├── AGT-011 (Documentation Agent)
├── AGT-012 (Performance Analyst)
└── AGT-013 (Monitor Agent)
```

---

## 3. ARCHITECTURE OVERVIEW

### 3.1 System Design
The system operates as a **directed acyclic graph (DAG)** of agent tasks. The Orchestrator maintains the task graph and routes outputs between agents. Agents communicate via a shared **Message Bus** and read/write to a shared **State Store**.

### 3.2 Shared Infrastructure
- **Message Bus:** All inter-agent messages are published to and consumed from the message bus. Format: JSON. Schema: see Section 12.
- **State Store:** A key-value store holding the current build state, all artifacts, and logs. Agents MUST read before writing to avoid conflicts.
- **Artifact Repository:** All generated files (code, specs, configs) are versioned and stored here. Paths follow the convention: `/{phase}/{agent_id}/{artifact_name}.{ext}`
- **Audit Log:** Append-only log of every agent action. Used for compliance and debugging.

### 3.3 Execution Modes
- **Sequential:** Phases execute one after another. Used when agents have strict dependencies.
- **Parallel:** Independent agents within a phase may execute simultaneously. Orchestrator manages concurrency.
- **Iterative:** QA, Security, and Performance findings may trigger a loop back to Development phases. Max loop depth: 3 unless overridden.

---

## 4. PHASE 0: INGESTION & ORCHESTRATION

**Owner:** AGT-000 (Orchestrator)
**Trigger:** Human submits a project brief or task description.
**Gate:** Human approval of the generated task graph.

### 4.1 Input Processing
1. AGT-000 receives the raw project brief.
2. AGT-000 tokenizes and classifies the request into one of: `[web_app, api, mobile_app, desktop_app, cli, data_pipeline, microservice, other]`.
3. AGT-000 identifies which agents are required for this build. Agents not required are marked `INACTIVE` for this run.
4. AGT-000 generates a **Task Graph** with the following fields per node:
   - `task_id`: Unique identifier (e.g., `T-001`)
   - `agent_id`: Assigned agent
   - `phase`: Phase number
   - `depends_on`: Array of task_ids that must complete first
   - `description`: One-line description of the task
   - `estimated_tokens`: Token estimate for budgeting
   - `human_gate`: Boolean — does this task require human approval before the next phase?
5. AGT-000 publishes the task graph to the State Store under key: `build/{build_id}/task_graph`.
6. AGT-000 posts a summary to the human interface and awaits approval.

### 4.2 Build Manifest
Upon approval, AGT-000 creates the **Build Manifest**:
```json
{
  "build_id": "BLD-20240115-001",
  "project_name": "string",
  "project_type": "string",
  "created_at": "ISO8601",
  "status": "IN_PROGRESS",
  "active_agents": ["AGT-001", "AGT-002", ...],
  "current_phase": 1,
  "task_graph": {...},
  "human_gates_passed": []
}
```

### 4.3 Orchestrator Ongoing Duties
- Poll agent status every N seconds (configurable; default: 30s).
- On agent failure, trigger the Error Handling Protocol (Section 13).
- Update `build.status` on all state transitions.
- Enforce the maximum execution time per agent task (`default: 300s`; override allowed per task).
- Route agent outputs to the correct downstream agents.

---

## 5. PHASE 1: PLANNING & SPECIFICATION

**Owner:** AGT-001 (Requirements Analyst)
**Depends On:** Phase 0 complete, Build Manifest approved.
**Gate:** Human approval of PRD.

### 5.1 Requirements Gathering
1. AGT-001 reads the raw project brief from the State Store.
2. AGT-001 identifies and categorizes all requirements into:
   - **Functional Requirements (FR):** What the system must do. Numbered FR-001, FR-002, ...
   - **Non-Functional Requirements (NFR):** Performance, scalability, security, accessibility. Numbered NFR-001, ...
   - **Constraints:** Technical, budget, timeline, regulatory. Numbered CON-001, ...
   - **Assumptions:** Numbered ASM-001, ...
   - **Out of Scope:** Explicit exclusions. Numbered OOS-001, ...

### 5.2 PRD Structure
AGT-001 MUST produce a Product Requirements Document (PRD) containing:

```
# Product Requirements Document
## 1. Executive Summary
## 2. Problem Statement
## 3. Goals & Success Metrics
   - Primary KPIs with measurable targets
## 4. User Personas
   - Persona name, role, goals, pain points
## 5. User Stories
   - Format: "As a [persona], I want to [action] so that [benefit]."
   - Acceptance criteria for each story
## 6. Functional Requirements
   - FR-XXX: [Description] | Priority: [P0/P1/P2] | Complexity: [S/M/L/XL]
## 7. Non-Functional Requirements
   - NFR-XXX: [Description] | Category: [Performance/Security/Accessibility/...]
## 8. Constraints
## 9. Assumptions
## 10. Out of Scope
## 11. Open Questions
## 12. Revision History
```

### 5.3 Feature Matrix
AGT-001 also outputs a Feature Matrix in CSV-compatible format:

| Feature ID | Name | Description | Priority | FR Reference | Story Points | Phase |
|---|---|---|---|---|---|---|
| FEAT-001 | ... | ... | P0 | FR-001 | 5 | MVP |

### 5.4 Outputs
- `PRD.md` → State Store key: `build/{build_id}/artifacts/phase1/PRD.md`
- `feature_matrix.json` → State Store key: `build/{build_id}/artifacts/phase1/feature_matrix.json`

---

## 6. PHASE 2: DESIGN

**Parallel execution:** AGT-002 (Architecture) and AGT-003 (UX) run simultaneously.
**Gate:** Human approval of Architecture Document and UI spec.

### 6.1 AGT-002: System Architecture

**6.1.1 Technology Stack Selection**
AGT-002 MUST select and justify the tech stack based on:
- NFRs from the PRD (especially performance, scalability, security)
- Team constraints listed in assumptions
- Ecosystem maturity and community support
- Licensing compatibility

For each selected technology, AGT-002 records an **Architecture Decision Record (ADR)**:
```markdown
# ADR-XXX: [Decision Title]
**Date:** YYYY-MM-DD
**Status:** Accepted | Proposed | Deprecated
**Context:** Why a decision was needed.
**Decision:** What was decided.
**Rationale:** Why this option over alternatives.
**Alternatives Considered:** List with rejection reasons.
**Consequences:** Trade-offs accepted.
```

**6.1.2 Architecture Document**
Must include:
- System context diagram (described in structured text or Mermaid)
- Component diagram with all services, their responsibilities, and interfaces
- Data flow diagram for each major user journey
- API boundary definitions
- Database architecture summary
- Infrastructure topology (cloud provider, regions, services)
- Security architecture overview (auth method, encryption at rest/in transit)
- Scalability strategy (horizontal/vertical, auto-scaling triggers)
- Disaster recovery approach

**6.1.3 API Contract**
AGT-002 produces an OpenAPI 3.0 specification stub:
```yaml
openapi: 3.0.0
info:
  title: [App Name] API
  version: 1.0.0
paths:
  /resource:
    get:
      summary: ...
      parameters: [...]
      responses:
        200:
          description: Success
          content:
            application/json:
              schema: {...}
```

### 6.2 AGT-003: UX Design

**6.2.1 Information Architecture**
- Site map / screen flow diagram (Mermaid or structured text)
- Navigation hierarchy
- Content model (what data appears on each screen)

**6.2.2 UI Specification**
For each screen/component, AGT-003 produces:
```
## Screen: [Screen Name]
**Route:** /path
**Trigger:** [How user reaches this screen]
**Purpose:** [One-line description]

### Layout
[Describe layout in structured text: header, sidebar, main content, footer regions]

### Components
- Component Name: [Description, state variants, interactions]
- ...

### Data Requirements
- Fields displayed: [list]
- Fields editable: [list]
- API calls triggered: [list of endpoint references]

### Edge Cases & Empty States
- Empty state: [Description]
- Error state: [Description]
- Loading state: [Description]
```

**6.2.3 Design System Spec**
- Color palette (primary, secondary, accent, semantic: success/warning/error/info)
- Typography scale (font family, size scale, weights, line heights)
- Spacing system (base unit, scale)
- Component library list (buttons, inputs, cards, modals, tables, etc.)
- Accessibility requirements: WCAG 2.1 AA minimum

### 6.3 Phase 2 Outputs
- `architecture.md`
- `adr/ADR-001.md` ... `ADR-NNN.md`
- `openapi_stub.yaml`
- `ui_spec.md`
- `design_system.md`

---

## 7. PHASE 3: DEVELOPMENT

**Owner:** AGT-004 (Lead Developer) coordinating AGT-005, AGT-006, AGT-007.
**Parallel execution:** AGT-005, AGT-006, AGT-007 work simultaneously on their domains.
**Gate:** Code review by AGT-004. Human spot-check optional.

### 7.1 AGT-004: Lead Developer

**7.1.1 Repository Setup**
1. Initialize repository structure per the following convention:
```
/
├── .github/
│   └── workflows/
├── apps/
│   ├── frontend/
│   └── backend/
├── packages/
│   └── shared/
├── infrastructure/
├── docs/
├── scripts/
├── .env.example
├── docker-compose.yml
├── README.md
└── package.json (or equivalent root config)
```
2. Create `.env.example` with all required environment variables (no real values).
3. Set up linting, formatting, and pre-commit hooks.
4. Define module interface contracts that AGT-005 and AGT-006 will implement.

**7.1.2 Code Review Protocol**
Before marking a development subtask complete, AGT-004 MUST verify:
- [ ] Code follows the project's style guide
- [ ] All functions have input/output type annotations
- [ ] No hardcoded secrets or credentials
- [ ] No `TODO` or `FIXME` without a linked issue ID
- [ ] Error handling is present on all async operations and external calls
- [ ] Logging is present at appropriate severity levels
- [ ] Code is modular — no function exceeds 50 lines without justification
- [ ] No unused imports or dead code

### 7.2 AGT-005: Frontend Developer

**7.2.1 Component Development Rules**
- Build components in isolation before integrating into pages.
- Every component MUST have:
  - Default props / fallback values
  - Loading state handling
  - Error state handling
  - Empty state handling
  - Responsive behavior defined (mobile-first)
- State management: use the pattern specified in the Architecture Document. Do not deviate.
- API calls: use only the shared API client module. No direct `fetch` or `axios` calls in components.

**7.2.2 Accessibility Checklist (per component)**
- [ ] All interactive elements are keyboard accessible
- [ ] All images have descriptive `alt` attributes
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for normal text)
- [ ] `aria-label` or `aria-labelledby` on all form elements
- [ ] Focus order is logical
- [ ] Dynamic content updates announced via `aria-live`

**7.2.3 Performance Rules**
- Images: use next-gen formats (WebP/AVIF). Lazy-load below-the-fold images.
- Code splitting: route-level at minimum. Component-level for heavy widgets.
- No render-blocking resources in `<head>` without `async` or `defer`.
- Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1.

### 7.3 AGT-006: Backend Developer

**7.3.1 API Development Rules**
Every API endpoint MUST:
- Validate all incoming request data against a schema (not just type-check).
- Return structured error responses:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [{"field": "email", "issue": "Invalid format"}],
    "request_id": "uuid"
  }
}
```
- Implement rate limiting at the route level.
- Return appropriate HTTP status codes. Never return 200 for an error.
- Include `request_id` in all responses for traceability.
- Log all requests at INFO level with: method, path, status code, duration_ms, request_id.

**7.3.2 Business Logic Rules**
- All business logic lives in the Service layer. No business logic in controllers/handlers or in database queries.
- Service functions must be pure where possible (same inputs → same outputs, no hidden side effects).
- All external service calls (email, payment, third-party APIs) are wrapped in a dedicated adapter module with a defined interface.

**7.3.3 Authentication & Authorization**
- Auth implementation MUST follow the method specified in the Architecture Document (e.g., JWT, OAuth2, session-based).
- Authorization checks MUST be in middleware or a dedicated authorization layer — never inline in business logic.
- Sensitive routes MUST require authentication. No exception without documented justification.

### 7.4 AGT-007: Database Administrator

**7.4.1 Schema Design Rules**
- Every table MUST have: `id` (primary key, UUID preferred), `created_at`, `updated_at`.
- Soft deletes: use `deleted_at` timestamp column rather than hard deletes, unless explicitly excluded in PRD.
- Foreign keys MUST be explicitly defined with cascade behavior specified.
- Indexes: create indexes on all foreign keys, all columns used in WHERE clauses, all columns used in ORDER BY.
- No nullable columns without a documented reason.

**7.4.2 Migration Rules**
- All schema changes are implemented as versioned migration files. Never modify existing migrations.
- Migration filename format: `{timestamp}_{description}.sql` or equivalent ORM format.
- Every migration MUST have a corresponding rollback/down migration.
- Migrations MUST be idempotent where possible.
- Before merging any migration, AGT-007 MUST verify it runs successfully on a clean database and rolls back cleanly.

**7.4.3 Query Rules**
- No raw string interpolation in queries. Use parameterized queries or ORM query builders exclusively.
- Queries returning potentially large result sets MUST implement pagination.
- N+1 query patterns are prohibited. Use joins or data loaders.
- Slow query threshold: any query taking > 100ms on expected production data volume must be flagged and optimized.

---

## 8. PHASE 4: TESTING & QA

**Owner:** AGT-008 (QA Engineer)
**Depends On:** Phase 3 code complete in each module.
**Gate:** All P0/P1 tests passing. Coverage thresholds met. Human sign-off.

### 8.1 Test Strategy
AGT-008 MUST produce a Test Strategy Document covering:
- Scope of testing
- Testing types and tools selected
- Coverage targets
- Test environment requirements
- Entry and exit criteria per phase

### 8.2 Required Test Types

**8.2.1 Unit Tests**
- Coverage target: minimum 80% line coverage on business logic and utility modules.
- Every function with conditional logic MUST have tests for each branch.
- Tests must be independent (no shared mutable state between tests).
- Use mocks/stubs for all external dependencies.

**8.2.2 Integration Tests**
- Every API endpoint MUST have at least one integration test covering the happy path.
- Integration tests MUST cover: auth-required routes, validation failures, and database interactions.
- Use a dedicated test database, not a shared or production database.

**8.2.3 End-to-End (E2E) Tests**
- Cover all critical user journeys defined in User Stories.
- P0 flows must have full E2E coverage before deployment.
- E2E tests MUST run against a staging environment, not local.

**8.2.4 Contract Tests**
- For every external API dependency, maintain a contract test that verifies the expected request/response shape.

**8.2.5 Accessibility Tests**
- Automated accessibility scans using `axe-core` or equivalent on every page.
- Manual keyboard navigation test for all critical flows.

**8.2.6 Performance Tests**
- Load test: simulate expected peak concurrent users. Define acceptable response time at Pxx (P95 < 500ms default).
- Stress test: find the breaking point. Document it.
- Soak test: run at 70% expected load for 30 minutes. No memory leaks allowed.

### 8.3 Bug Classification

| Severity | Definition | SLA to Fix |
|---|---|---|
| S1 - Critical | App unusable, data loss risk, security vulnerability | Before next deployment |
| S2 - High | Core feature broken, no workaround | Current sprint |
| S3 - Medium | Feature degraded, workaround exists | Next sprint |
| S4 - Low | Minor UI issue, cosmetic, edge case | Backlog |

All S1 and S2 bugs found by AGT-008 trigger a loop back to Phase 3. The Orchestrator manages this loop.

### 8.4 QA Exit Criteria
Before AGT-008 marks Phase 4 complete:
- [ ] Unit test coverage ≥ 80% on all target modules
- [ ] All P0 user stories have passing E2E tests
- [ ] Zero open S1 or S2 bugs
- [ ] Accessibility scan shows zero critical violations
- [ ] Performance test results documented and within targets
- [ ] Test report generated and stored in artifact repository

---

## 9. PHASE 5: SECURITY REVIEW

**Owner:** AGT-009 (Security Analyst)
**Depends On:** Phase 4 complete.
**Gate:** Zero critical/high severity security findings unresolved. Human sign-off required.

### 9.1 Security Review Scope
AGT-009 performs the following checks:

**9.1.1 Static Application Security Testing (SAST)**
- Run SAST tooling on all source code.
- Check for: injection vulnerabilities, hardcoded secrets, insecure dependencies, unsafe regex.

**9.1.2 Dependency Audit**
- Audit all dependencies for known CVEs.
- Any dependency with a critical or high CVE MUST be updated or replaced before deployment.

**9.1.3 OWASP Top 10 Checklist**
AGT-009 MUST verify the following for every application:
- [ ] A01 Broken Access Control: Authorization checks on all protected resources
- [ ] A02 Cryptographic Failures: Data encrypted at rest and in transit; no weak algorithms (MD5, SHA1)
- [ ] A03 Injection: All inputs parameterized; no eval() or dynamic query construction from user input
- [ ] A04 Insecure Design: Threat model reviewed against architecture
- [ ] A05 Security Misconfiguration: No default credentials; debug mode off in production; headers configured
- [ ] A06 Vulnerable Components: All dependencies up to date and audited
- [ ] A07 Auth Failures: Brute force protection; secure session management; MFA available for sensitive roles
- [ ] A08 Software Integrity Failures: Dependency integrity verification; signed artifacts
- [ ] A09 Logging Failures: Security events logged; no sensitive data in logs
- [ ] A10 SSRF: All outbound URL requests validated against an allowlist

**9.1.4 Security Headers Verification**
For web applications, the following HTTP security headers MUST be present:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `Strict-Transport-Security` (HSTS)
- `Referrer-Policy`
- `Permissions-Policy`

**9.1.5 Secrets Scan**
- Scan all files (including git history) for accidentally committed secrets.
- If found: invalidate the secret immediately, rotate, and purge from git history.

### 9.2 Security Report Format
```
# Security Review Report
**Build ID:** BLD-XXXXXXXX
**Date:** YYYY-MM-DD
**Reviewer:** AGT-009

## Executive Summary
## Findings
| ID | Severity | Category | Description | Remediation | Status |
## OWASP Top 10 Checklist Results
## Dependency Audit Results
## Recommendations
```

### 9.3 Security Exit Criteria
- [ ] Zero critical severity findings unresolved
- [ ] Zero high severity findings unresolved
- [ ] All medium findings documented with remediation plan
- [ ] OWASP Top 10 checklist 100% complete
- [ ] Security report stored in artifact repository
- [ ] Human sign-off obtained

---

## 10. PHASE 6: DEVOPS & DEPLOYMENT

**Owner:** AGT-010 (DevOps Engineer)
**Depends On:** Phases 4 and 5 complete.
**Gate:** Successful staging deployment. Human approval for production deployment.

### 10.1 CI/CD Pipeline Setup
AGT-010 MUST configure a CI/CD pipeline with the following stages:

```
Trigger (push/PR) →
  [1] Lint & Format Check →
  [2] Unit Tests →
  [3] Build →
  [4] Integration Tests →
  [5] SAST Scan →
  [6] Container Image Build & Scan →
  [7] Deploy to Staging →
  [8] E2E Tests (Staging) →
  [9] Performance Tests (Staging) →
  [10] Human Approval Gate →
  [11] Deploy to Production →
  [12] Smoke Tests (Production) →
  [13] Notify
```

Any stage failure MUST:
1. Halt the pipeline immediately.
2. Notify the Orchestrator.
3. Log the failure with the stage name, error output, and timestamp.
4. Block the branch from merging until resolved.

### 10.2 Infrastructure as Code (IaC)
- All infrastructure MUST be defined as code (Terraform, Pulumi, CDK, or equivalent).
- No manual infrastructure changes in any environment.
- IaC code is stored in `/infrastructure/` and versioned with the application.
- Every infrastructure component must have:
  - Description tags/comments
  - Environment variable (dev/staging/prod) parameterization
  - Cost estimation annotation

### 10.3 Environment Configuration
AGT-010 MUST configure three environments minimum:

| Environment | Purpose | Deployment Trigger | Data |
|---|---|---|---|
| Development | Active development | On-demand | Synthetic/seeded |
| Staging | Pre-production validation | On merge to main | Anonymized prod copy |
| Production | Live users | Human-approved | Real data |

### 10.4 Container & Runtime Security
- Base images: use official, minimal images (e.g., `alpine`, `distroless`). No `latest` tags.
- Run containers as non-root users.
- No secrets in container images or environment variables passed through unsecured channels. Use a secrets manager.
- Container images MUST be scanned for vulnerabilities before deployment.
- Resource limits (CPU, memory) MUST be defined for every container.

### 10.5 Deployment Strategy
Select and implement one of the following based on NFRs:
- **Blue/Green:** Two identical environments; switch traffic instantly. Use when zero downtime is required.
- **Rolling:** Gradually replace old instances with new. Use for standard updates.
- **Canary:** Route X% of traffic to new version before full rollout. Use for high-risk changes.

The chosen strategy and rationale MUST be documented in an ADR.

### 10.6 Rollback Protocol
- Rollback MUST be executable with a single command or pipeline trigger.
- Rollback procedure MUST be documented and tested before first production deployment.
- Database migrations that are deployed with a release must have a tested rollback migration.
- RTO (Recovery Time Objective) for rollback: < 5 minutes default unless specified in NFRs.

---

## 11. PHASE 7: MONITORING & OBSERVABILITY

**Owner:** AGT-013 (Monitor Agent) with input from AGT-012 (Performance Analyst)
**Depends On:** Phase 6 production deployment complete.
**Gate:** All dashboards live, all alerts tested, on-call runbook complete.

### 11.1 The Three Pillars of Observability

**11.1.1 Metrics**
AGT-013 MUST configure collection and dashboards for:

Application Metrics:
- Request rate (requests/second)
- Error rate (% of 5xx responses)
- P50, P95, P99 response latency
- Active users / sessions
- Feature-specific business metrics (defined per PRD KPIs)

Infrastructure Metrics:
- CPU utilization per service
- Memory utilization per service
- Disk I/O and available disk space
- Network throughput and error rates
- Database connection pool usage, query latency, replication lag

**11.1.2 Logs**
- Centralized log aggregation is mandatory (ELK, Datadog, CloudWatch, etc.).
- Log retention: minimum 90 days hot, 1 year cold.
- Log levels used consistently: DEBUG (local only), INFO (normal operations), WARN (degraded but functional), ERROR (failed operation), FATAL (system-level failure).
- Structured logging (JSON format) is mandatory. No unstructured log lines.
- Never log PII, passwords, tokens, or payment details.

**11.1.3 Traces**
- Distributed tracing is required for any multi-service architecture.
- Every request MUST carry a `trace_id` from entry to all downstream services.
- Traces MUST be sampled at minimum 10% in production, 100% in staging.

### 11.2 Alerting Rules
AGT-013 MUST configure the following baseline alerts:

| Alert Name | Condition | Severity | Notification Channel |
|---|---|---|---|
| High Error Rate | error_rate > 5% for 5 min | P1 | PagerDuty / on-call |
| High Latency | P99 latency > 2s for 5 min | P2 | Slack + on-call |
| Service Down | health check failing for 1 min | P1 | PagerDuty |
| High CPU | CPU > 85% for 10 min | P2 | Slack |
| High Memory | Memory > 90% for 10 min | P1 | Slack + on-call |
| Disk Space Low | Disk > 80% full | P2 | Slack |
| Cert Expiry | SSL cert expires in < 30 days | P3 | Slack |
| Failed Deployments | Deployment pipeline fails | P2 | Slack |

### 11.3 Runbook
AGT-013 MUST produce an Operational Runbook with:
- Architecture diagram (runtime view)
- Service dependency map
- For each P1/P2 alert: step-by-step investigation and remediation procedure
- On-call escalation path
- Scheduled maintenance procedure
- Backup and restore procedure

### 11.4 Performance Monitoring (AGT-012)
Post-deployment, AGT-012 establishes:
- Baseline performance benchmarks from Phase 4 load tests stored in the State Store.
- Weekly automated performance regression runs.
- Performance budget alerts (if Core Web Vitals degrade beyond 10% from baseline, trigger alert).

---

## 12. INTER-AGENT COMMUNICATION PROTOCOL

### 12.1 Message Schema
All messages on the Message Bus MUST conform to:
```json
{
  "message_id": "uuid",
  "build_id": "BLD-XXXXXXXX",
  "timestamp": "ISO8601",
  "from_agent": "AGT-XXX",
  "to_agent": "AGT-XXX | BROADCAST",
  "message_type": "TASK_ASSIGNED | TASK_COMPLETE | TASK_FAILED | ARTIFACT_READY | BLOCKER | STATUS_UPDATE | HUMAN_GATE_REQUEST",
  "payload": {
    "task_id": "T-XXX",
    "artifact_key": "path/to/artifact",
    "status": "string",
    "details": "string",
    "error": null
  },
  "requires_ack": true
}
```

### 12.2 Message Types
- `TASK_ASSIGNED`: Orchestrator assigns a task to an agent. Agent MUST acknowledge within 10s.
- `TASK_COMPLETE`: Agent reports successful task completion. MUST include artifact_key.
- `TASK_FAILED`: Agent reports failure. MUST include error details. Triggers Error Handling Protocol.
- `ARTIFACT_READY`: Agent notifies downstream agents that an artifact is available.
- `BLOCKER`: Agent has encountered a blocker it cannot resolve autonomously. Requires Orchestrator intervention.
- `STATUS_UPDATE`: Periodic heartbeat from active agent. If not received within 60s, agent is considered stuck.
- `HUMAN_GATE_REQUEST`: Orchestrator requests human approval. Includes summary, artifact links, and approval/rejection options.

### 12.3 Artifact Handoff Protocol
When Agent A produces an artifact consumed by Agent B:
1. Agent A writes artifact to State Store at the defined key.
2. Agent A publishes `ARTIFACT_READY` message with the artifact key.
3. Orchestrator verifies artifact exists in State Store.
4. Orchestrator assigns the downstream task to Agent B with `TASK_ASSIGNED`.
5. Agent B reads artifact from State Store and begins its task.

---

## 13. ERROR HANDLING & ESCALATION

### 13.1 Agent Error Classification

| Error Type | Definition | Automatic Resolution | Escalation Path |
|---|---|---|---|
| Transient | Temporary failure (network, timeout) | Retry up to 3x with exponential backoff | If 3 retries fail → BLOCKER |
| Validation | Output does not meet schema/spec | Agent self-corrects once | If correction fails → Orchestrator |
| Dependency | Required upstream artifact missing | Wait up to timeout | Orchestrator re-checks pipeline |
| Critical | Unrecoverable agent failure | None | Immediate HITL escalation |
| Security | Security vulnerability found | AGT-009 flags and stops pipeline | HITL required to approve fix or override |

### 13.2 Retry Policy
```
Attempt 1: Immediate retry
Attempt 2: Retry after 5 seconds
Attempt 3: Retry after 30 seconds
Failure: Publish TASK_FAILED to Message Bus
```

### 13.3 HITL Escalation Protocol
When human escalation is required:
1. Orchestrator suspends the affected pipeline branch.
2. Orchestrator formats a Human Escalation Report:
   - Build ID and current phase
   - Which agent failed and why
   - Relevant artifact links
   - Options presented to human: [Retry / Modify Input / Override / Abort]
3. Pipeline resumes only upon human response.
4. Human decision is logged to Audit Trail.

### 13.4 Pipeline Abort Protocol
If human selects Abort:
1. All active agents receive a `SHUTDOWN` signal.
2. All agents complete current atomic operation and stop.
3. All agent state is flushed to the State Store.
4. A final Build Report is generated with status `ABORTED`.
5. All cloud resources provisioned for this build that are not required for persistence are decommissioned.

---

## 14. MEMORY & CONTEXT MANAGEMENT

### 14.1 Shared Context Structure
The Orchestrator maintains a `build_context` object in the State Store:
```json
{
  "build_id": "string",
  "project_type": "string",
  "tech_stack": {},
  "key_decisions": [],
  "constraints": [],
  "open_questions": [],
  "resolved_questions": [],
  "phase_summaries": {},
  "latest_artifacts": {}
}
```

### 14.2 Agent Context Loading
Before beginning a task, every agent MUST:
1. Read the full `build_context` from State Store.
2. Read the specific artifacts listed as dependencies for their task.
3. Read all ADRs to understand decisions already made.
4. NOT re-litigate decisions already recorded in ADRs unless explicitly asked.

### 14.3 Context Window Management
For agents with token limits:
- Agents MUST summarize completed phases rather than retaining full transcripts.
- Summaries are stored in `build_context.phase_summaries`.
- When context window is approaching limit, agent MUST flush a summary and request a context reset from Orchestrator.

### 14.4 Long-Running Build Checkpointing
- Checkpoints are saved every time a phase completes.
- If a build is interrupted, it can be resumed from the last checkpoint.
- Checkpoint key: `build/{build_id}/checkpoint/{phase_number}`

---

## 15. OUTPUT STANDARDS

### 15.1 Code Quality Standards
- All code MUST pass the project linter with zero errors before being marked complete.
- All code MUST be formatted with the project formatter (Prettier, Black, gofmt, etc.).
- All public functions/methods MUST have documentation comments.
- Cyclomatic complexity: no function should exceed a complexity score of 10 without documented justification.

### 15.2 Documentation Standards
- Every project MUST have a `README.md` containing:
  - Project name and one-line description
  - Prerequisites and installation instructions
  - Environment variable reference (all variables, their purpose, whether required or optional)
  - How to run locally
  - How to run tests
  - How to deploy
  - Architecture overview link
  - Contributing guide reference
  - License

- API documentation MUST be auto-generated from code annotations or OpenAPI spec. Never hand-written only.

### 15.3 Git Standards
- Branch naming: `feature/{issue-id}-short-description`, `fix/{issue-id}-description`, `chore/description`
- Commit message format (Conventional Commits):
  ```
  type(scope): short description

  Optional body explaining why, not what.

  Optional footer with breaking change notice or issue reference.
  ```
  Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`
- No commit may contain a mix of unrelated changes.
- All commits must pass pre-commit hooks before being accepted.

### 15.4 Artifact Naming Convention
```
/{phase_number}_{phase_name}/{agent_id}/{artifact_name}.{ext}
```
Examples:
- `/01_planning/AGT-001/PRD.md`
- `/02_design/AGT-002/architecture.md`
- `/03_development/AGT-005/frontend_component_index.md`

---

## 16. COMPLIANCE & AUDIT TRAIL

### 16.1 Mandatory Audit Events
Every following event MUST be logged to the Audit Log:
- Build created
- Any agent task assigned, started, completed, or failed
- Any artifact written to the State Store
- Any human gate requested and the human's response
- Any retry attempt
- Any escalation
- Any override of this SOP
- Build completed or aborted

### 16.2 Audit Log Entry Format
```json
{
  "log_id": "uuid",
  "build_id": "string",
  "timestamp": "ISO8601",
  "event_type": "string",
  "agent_id": "string | HUMAN | SYSTEM",
  "task_id": "string | null",
  "artifact_key": "string | null",
  "description": "string",
  "metadata": {}
}
```

### 16.3 Build Report
Upon completion or abort of any build, AGT-000 MUST generate a final Build Report:
```
# Build Report: {build_id}
**Status:** COMPLETE | ABORTED | FAILED
**Start Time:** ISO8601
**End Time:** ISO8601
**Total Duration:** HH:MM:SS

## Summary
## Phases Completed
## Artifacts Produced (with keys)
## Human Gates (with decisions and timestamps)
## Errors & Resolutions
## Security Findings Summary
## Test Results Summary
## Performance Results Summary
## Open Items (unresolved M/L severity bugs, tech debt logged)
## Recommendations for Next Iteration
```

### 16.4 SOP Override Policy
Any deviation from this SOP MUST:
1. Be proposed by an agent with a `BLOCKER` message that includes the override request.
2. Be reviewed and approved by a human operator.
3. Be logged to the Audit Trail with justification.
4. Be documented as a proposed update to this SOP for future review.

---

*End of Document*
*SOP Version 2.0.0 | Multi-Agent Application Development System*
*All agents operating under this protocol are bound by its terms for the duration of any build.*
