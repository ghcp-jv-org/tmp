# Agentic DevOps Labs

> **Audience:** Developers and DevOps engineers  
> **Application:** Book management app ([ps-copilot-sandbox/copilot-agent-and-mcp](https://github.com/ps-copilot-sandbox/copilot-agent-and-mcp))  
> **Duration:** ~7 hours total (45-60 min per lab)

---

## Lab Index

| Lab | Title | Mode | Duration |
|---|----|---|-----|
| [00](00-prerequisites.md) | Prerequisites & Environment Setup | - | 15 min |
| [01](lab-01-agent-mode.md) | Agent Mode - Interactive Feature Development | VS Code | 45 min |
| [02](lab-02-coding-agent.md) | Coding Agent - Autonomous PR Workflow | GitHub.com | 45 min |
| [03](lab-03-mcp-security.md) | Security Remediation | GitHub.com + VS Code | 60 min |
| [04](lab-04-mcp-builder.md) | Build an MCP Server with MCP Builder Skill | VS Code | 60 min |
| [05](lab-05-mcp-data.md) | Agent Mode + MCP - External Data Integration | VS Code + MCP | 45 min |
| [06](lab-06-test-generation.md) | Automated Test Generation & Code Quality | VS Code + GitHub.com | 45 min |
| [07](lab-07-code-modernization.md) | Code Modernization & Refactoring | VS Code + GitHub.com | 45 min |
| [08](lab-08-cicd-generation.md) | CI/CD Pipeline Generation | VS Code + GitHub.com | 45 min |
| [09](lab-09-iac.md) | Infrastructure as Code | VS Code + GitHub.com | 45 min |
| [10](lab-10-multi-agent-governance.md) | Multi-Agent Development & Governance | GitHub.com | 45 min |
| [11](lab-11-sre-agent.md) | Azure SRE Agent - Closed-Loop Incident Triage | Azure + GitHub.com | 60 min |

---

## End-to-End Flow

```
IDE → GitHub → Agents → MCP → Testing → Modernization → CI/CD → IaC → Governance → Production → Incident → Fix
 L01    L02      L01-02   L04    L06        L07            L08    L09     L10          L11          L11       L11
        L03      L03      L05
```

---

## Conventions

- Every lab follows the same template: Objective → Exercises → Validation
- Commands and prompts are in code blocks - copy-paste ready
- Expected outputs appear after each step
- Each exercise ends with a checklist
