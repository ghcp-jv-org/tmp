# Lab 09 - Infrastructure as Code

> **Mode:** VS Code + GitHub.com  
> **Duration:** 45 min  
> **Prerequisite:** [Lab 00](00-prerequisites.md)  
> **Optional:** Azure subscription (for deployment validation)

---

## Objective

Use Copilot to generate, update, and validate Infrastructure as Code templates. Covers Bicep and Terraform generation for deploying the book management app.

| Exercise | Skill | What You Learn |
|-----|----|--------|
| 1 | **IaC generation (Bicep)** | Generate a Bicep template from app requirements - the agent maps your stack to Azure resources |
| 2 | **Cross-format translation (Terraform)** | Generate the same infrastructure in Terraform - compare how the agent handles different IaC languages |
| 3 | **IaC evolution via Coding Agent** | Add Key Vault and managed identity via a GitHub issue - the agent modifies both Bicep and Terraform consistently |
| 4 | **IaC security review** | Use Agent Mode to audit the templates for security and cost - AI as an infrastructure reviewer |

---

## Exercise 1: IaC Generation - Bicep from App Requirements

> **Purpose:** Generate a Bicep template by describing your application’s infrastructure needs. The agent maps your stack (Node.js backend, static frontend, monitoring) to Azure resources. You review the generated template to learn how Bicep structures resources, parameters, and outputs.

### Step 1: Request IaC Generation

In Agent Mode:

```
#codebase

Generate a Bicep template at infra/main.bicep to deploy this application to Azure:
1. Azure App Service (Linux, Node.js 20) for the backend
2. Azure Static Web App for the frontend
3. Application Insights for monitoring
4. Parameters for: environment name, location, SKU

Include:
- A parameters file at infra/main.parameters.json with dev defaults
- Output the App Service URL and Static Web App URL
- Add comments explaining each resource
```

### Step 2: Review the Template

Open `infra/main.bicep` and verify:

| Resource | Expected |
|-----|-----|
| `Microsoft.Web/serverfarms` | App Service Plan with Linux |
| `Microsoft.Web/sites` | App Service with Node.js 20 |
| `Microsoft.Web/staticSites` | Static Web App |
| `Microsoft.Insights/components` | Application Insights |
| Parameters | `environmentName`, `location`, `sku` |
| Outputs | URLs for both services |

### Step 3: Validate Syntax

If you have the Azure CLI and Bicep CLI installed:

```bash
az bicep build -file infra/main.bicep
```

**Expected:** No errors. If you don't have the CLI, review the template structure manually.

### Validation

- [ ] `main.bicep` created with all 4 resources
- [ ] `main.parameters.json` created with dev defaults
- [ ] Parameters are properly referenced
- [ ] Outputs defined
- [ ] Template builds without errors (if CLI available)

---

## Exercise 2: Cross-Format Translation - Terraform Alternative

> **Purpose:** Generate the same infrastructure in Terraform HCL. Compare how the agent translates the same requirements into a different IaC language - different syntax, same resources. This teaches that the agent understands infrastructure concepts, not just one template language.

### Step 1: Request Terraform Generation

```
#codebase

Generate a Terraform configuration at infra/terraform/ to deploy the same infrastructure:
1. main.tf - Azure App Service + Static Web App + Application Insights
2. variables.tf - input variables with defaults
3. outputs.tf - service URLs
4. providers.tf - azurerm provider configuration

Use the same resource structure as infra/main.bicep but in Terraform HCL syntax.
```

### Step 2: Review the Files

Check that each file is created and contains valid HCL:

| File | Contents |
|---|-----|
| `infra/terraform/main.tf` | Resource definitions |
| `infra/terraform/variables.tf` | Variables with types and defaults |
| `infra/terraform/outputs.tf` | Output values |
| `infra/terraform/providers.tf` | Provider block with version constraint |

### Step 3: Validate (Optional)

```bash
cd infra/terraform
terraform init
terraform validate
```

### Validation

- [ ] Terraform files created in correct structure
- [ ] Resources match the Bicep template
- [ ] Variables have types and defaults
- [ ] Provider version pinned
- [ ] `terraform validate` passes (if CLI available)

---

## Exercise 3: IaC Evolution - Add Secret Management via Coding Agent

> **Purpose:** Use the Coding Agent (via a GitHub issue) to add Key Vault, managed identity, and secret references to both Bicep and Terraform templates. This teaches using agents for cross-cutting infrastructure changes - updating multiple IaC files consistently from a single issue.

### Step 1: Create the Issue

On GitHub.com in Copilot Chat:

```
Create an issue with:
- Title: Add Azure Key Vault to infrastructure templates
- Body: Update infra/main.bicep to:
  1. Add an Azure Key Vault resource
  2. Store the Application Insights connection string as a Key Vault secret
  3. Configure the App Service to reference the Key Vault secret
  4. Add a managed identity on the App Service for Key Vault access
  5. Update outputs to include the Key Vault name
  Also update infra/terraform/main.tf with the equivalent changes.
```

### Step 2: Assign to Copilot

1. Assign to **Copilot**
2. Monitor in **Actions** tab

### Step 3: Review the PR

Verify:
- Key Vault resource added in both Bicep and Terraform
- Managed identity configured on App Service
- Key Vault access policy grants the identity read access
- App Service references Key Vault for secrets
- No hardcoded secrets in templates

### Validation

- [ ] Key Vault added to Bicep and Terraform
- [ ] Managed identity configured
- [ ] Secret references (not hardcoded values)
- [ ] Both templates remain internally consistent

---

## Exercise 4: IaC Security Review - Best Practices Audit

> **Purpose:** Use Agent Mode to review your generated templates for security gaps (missing HTTPS, public endpoints, hardcoded values) and cost issues (oversized SKUs). This teaches using AI as an infrastructure reviewer - catching issues before `az deploy` or `terraform apply`.

### Step 1: Review Templates for Best Practices

In Agent Mode:

```
Review infra/main.bicep for Azure security and cost optimization best practices:
- Are there any resources missing security configurations?
- Is HTTPS enforced?
- Are managed identities used instead of keys?
- Is the SKU appropriate for a dev environment?
- Are there any unnecessary public endpoints?

Suggest specific fixes.
```

### Step 2: Apply Fixes

Accept appropriate security improvements.

### Validation

- [ ] Security review completed
- [ ] At least one security improvement applied 
- [ ] Template still validates

---

## Troubleshooting

| Issue | Fix |
|----|---|
| Bicep build fails | Paste the error into Agent Mode for a fix |
| Terraform init fails | Check provider version constraints |
| Generated template is incomplete | Add more context about the app architecture in the prompt |
| No Azure CLI | Review templates manually - syntax validation is optional |
