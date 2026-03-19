# Lab: Agent Plugins in VS Code - Bundle and Share AI Customizations

> [!NOTE]  
> This lab uses the **Agent Plugins** feature (Preview) in VS Code to create, install, and manage prepackaged bundles of chat customizations. You will build a plugin for the **Book Favorites** app (`copilot-agent-and-mcp/`).
> 
> **Prerequisite:** Complete the [Custom Agents lab](custom-agents-exercise.md) and the [Hooks lab](hooks-exercise.md) first. This lab builds on the concepts and agents you created there.

## Overview

Agent plugins are **prepackaged bundles** of chat customizations that you can discover and install from plugin marketplaces. A single plugin can include any combination of slash commands, [agent skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills), [custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents), [hooks](https://code.visualstudio.com/docs/copilot/customization/hooks), and [MCP servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers).

Plugins work alongside your locally defined customizations. When you install a plugin, its commands, skills, agents, hooks, and MCP servers appear in chat just like the ones you created manually in earlier labs.

### Why Plugins?

In previous labs you created agents, hooks, and skills by hand inside `.github/`. Plugins solve the **distribution** problem: how do you share those customizations with teammates, across projects, or with the community? Instead of copying files manually, you package them into a plugin with a `plugin.json` manifest, publish to a marketplace (a Git repository), and anyone can install them with one click.

### What Plugins Can Bundle

| Customization Type | Example | Equivalent Manual Setup |
| --- | --- | --- |
| **Skills** | `test-runner/SKILL.md` | `.github/skills/` folders |
| **Agents** | `qa-reviewer.agent.md` | `.github/agents/` files |
| **Hooks** | `post-test-logger.json` | `.github/hooks/` configs |
| **MCP Servers** | MCP server config | `.vscode/mcp.json` entries |
| **Slash Commands** | `/run-tests` | Prompt files in `.github/prompts/` |

### What You Will Learn

*   How to enable agent plugins in VS Code
*   How to browse and install plugins from the default marketplaces
*   How to create a plugin with `plugin.json` metadata and bundled customizations
*   How to install, test, and manage plugins from local paths
*   How to configure additional plugin marketplaces
*   How plugins relate to the agents, hooks, and skills you built in earlier labs

### Prerequisites

| Requirement | Details |
| --- | --- |
| **VS Code** | Insiders or latest Stable with GitHub Copilot extension (Agent Mode enabled) |
| **GitHub Copilot** | Copilot Pro, Pro+, Business, or Enterprise subscription |
| **Workspace** | This repository cloned locally |
| **App running** | `npm install && npm start` in `copilot-agent-and-mcp/` - backend on :4000, frontend on :5173 |
| **Prior labs** | Completed Custom Agents and Hooks labs (familiarity with `.agent.md`, hooks, and skills) |

### Time Estimate

30 - 40 minutes

---

## Part 1 - Build a QA Testing Plugin End-to-End (30 min)

**Objective:** Enable agent plugins, explore the marketplace to see what's available, then build a complete plugin from scratch for the Book Favorites app. The plugin — `bookfaves-qa-plugin` — bundles a test-runner skill, a QA reviewer agent, and a post-test logging hook into a single distributable package.

### Exercise 1.1 - Enable Agent Plugins and Explore the Marketplace

Agent plugins are in Preview and must be enabled via a setting before you can build or install them.

1.  Open **Settings** (`Ctrl+,`).
2.  Search for `chat.plugins.enabled`.
3.  Check the box to enable it.

Alternatively, add this to your `settings.json`:

```json
{
  "chat.plugins.enabled": true
}
```

> **What this does:** Enables the plugin discovery, installation, and management UI in VS Code. Without this setting, the plugin views and menus are hidden.

Now take a quick look at what plugins the community has already published:

4.  Open the **Extensions view** (`Ctrl+Shift+X`).
5.  In the search field, enter `@agentPlugins` to filter for agent plugins.

    Alternatively, select the **More Actions** (three dots `···`) icon in the Extensions sidebar header, choose **Views** > **Agent Plugins**.

6.  Browse the list of available plugins from the default marketplaces.

> **Default marketplaces:** VS Code discovers plugins from the [copilot-plugins](https://github.com/github/copilot-plugins) and [awesome-copilot](https://github.com/github/awesome-copilot/) repositories by default.

7.  Select any plugin from the list to read its description and see what it bundles (skills, agents, hooks, etc.).
8.  Optionally, click **Install** on a plugin that interests you to see how installed plugins appear.

You can also manage installed plugins from the Chat view:

*   Click the **gear icon** (⚙) at the top of the Chat panel and select **Plugins**.
*   Installed plugins appear in the **Agent Plugins - Installed** view in the Extensions sidebar, where you can **enable**, **disable**, or **uninstall** them.

> **Security note:** Plugins can include hooks and MCP servers that **run code on your machine**. Always review the plugin contents and publisher before installing, especially for plugins from community marketplaces.

**Verify:**

*   `chat.plugins.enabled` is checked in settings
*   The `@agentPlugins` search returns a list of plugins from the default marketplaces
*   The **gear icon** menu in Chat includes a **Plugins** option

### Exercise 1.2 - Create the Plugin Directory and Metadata

Now build your own plugin. You will create a `bookfaves-qa-plugin/` folder at the workspace root with this target structure:

```
bookfaves-qa-plugin/
  plugin.json                        # Plugin metadata
  skills/
    test-runner/
      SKILL.md                       # Testing skill instructions
      scripts/
        run-tests.sh                 # Bash helper (Linux/macOS)
        run-tests.ps1                # PowerShell helper (Windows)
  agents/
    qa-reviewer.agent.md             # QA review agent (read-only)
  hooks/
    post-test-logger.json            # PostToolUse hook config
    scripts/
      log-test-results.js            # Hook script for logging
```

1.  Create the plugin root folder:

```
mkdir bookfaves-qa-plugin
```

2.  Create the `plugin.json` metadata file in `bookfaves-qa-plugin/`:

```json
{
  "name": "bookfaves-qa",
  "displayName": "Book Favorites QA Suite",
  "description": "Quality assurance plugin for the Book Favorites app. Bundles a test runner skill (Jest + Cypress), a QA reviewer agent, and a post-test logging hook.",
  "version": "1.0.0",
  "publisher": "bookfaves-team",
  "categories": ["testing", "quality"],
  "keywords": ["testing", "jest", "cypress", "code-review", "qa"]
}
```

> **About `plugin.json`:** This is the manifest that identifies the plugin to VS Code. The `name` field is the unique identifier, `displayName` is what users see in the plugin browser, and `description` helps users decide whether to install it.

### Exercise 1.3 - Add the Test Runner Skill

Create the test runner skill that teaches Copilot how to run and interpret tests for the Book Favorites app. Skills live in folders with a `SKILL.md` file and optional supporting resources (scripts, templates, examples). Copilot loads the SKILL.md when the skill matches your task, and reads supporting files only when referenced via relative paths.

#### Step 1 - Register the plugin's skill location

VS Code discovers skills from default locations (`.github/skills/`, `~/.copilot/skills/`, etc.). Since your plugin's skills live outside those defaults, register the plugin's skill folder so VS Code finds them.

1.  Open **Settings** (`Ctrl+,`) and search for `chat.agentSkillsLocations`.
2.  Click **Add Item** and enter:

```
bookfaves-qa-plugin/skills
```

3.  Save the setting. Your workspace `.vscode/settings.json` should now include:

```json
{
  "chat.agentSkillsLocations": [
    "bookfaves-qa-plugin/skills"
  ]
}
```

> **Why this step?** Without registering the location, VS Code won't discover the `test-runner` SKILL.md inside the plugin folder. Once registered, the skill appears in the **gear icon** > **Skills** menu and the `/` slash command list.

#### Step 2 - Create the skill using the gear icon

1.  In the Chat view, click the **gear icon** (⚙) at the top.
2.  Select **Skills** from the menu.
3.  Select **Create new skill**.
4.  Choose `bookfaves-qa-plugin/skills` as the location.
5.  Enter `test-runner` as the skill folder name.

This creates the `bookfaves-qa-plugin/skills/test-runner/` directory with an empty `SKILL.md`. Replace the generated content with:

```markdown
---
name: test-runner
description: Run and analyze tests for the Book Favorites app. Executes backend Jest tests and frontend Cypress E2E tests, interprets results, and suggests fixes for failures.
argument-hint: "Specify which tests to run: backend, frontend, or all"
---
# Test Runner Skill

You are a testing specialist for the Book Favorites app.

## Available Test Commands

| Test Suite | Command | Framework |
| --- | --- | --- |
| Backend unit tests | `npm run test:backend` | Jest |
| Frontend E2E tests | `npm run build:frontend && npm run test:frontend` | Cypress |
| All tests (bash) | `bash ./scripts/run-tests.sh` | Both |
| All tests (PowerShell) | `powershell -File ./scripts/run-tests.ps1` | Both |

## Supporting Scripts

This skill includes helper scripts in the `scripts/` folder to run all test suites in sequence:

- **Linux/macOS:** `bash ./scripts/run-tests.sh`
- **Windows:** `powershell -File ./scripts/run-tests.ps1`

To run all tests from the workspace root, invoke the full path:

    # Linux/macOS
    bash bookfaves-qa-plugin/skills/test-runner/scripts/run-tests.sh

    # Windows (PowerShell)
    powershell -File bookfaves-qa-plugin/skills/test-runner/scripts/run-tests.ps1

Or run individual suites directly from `copilot-agent-and-mcp/`:

    cd copilot-agent-and-mcp
    npm run test:backend                                    # backend only
    npm run build:frontend && npm run test:frontend         # frontend only

## Rules

1. Always start comments in the code with "generated-by-copilot: "
2. Always run tests from the `copilot-agent-and-mcp/` directory.
3. Run backend tests first - they are faster and catch API issues early.
4. If a test fails, read the failing test file and the source file it tests before suggesting a fix.
5. Never modify test expectations to make tests pass - fix the source code instead.
6. After fixing a failure, re-run the specific test suite to confirm the fix.
7. When running all tests, prefer the helper script (`./scripts/run-tests.sh` or `./scripts/run-tests.ps1`) to ensure consistent ordering.

## Interpreting Test Output

- **Jest**: Look for `FAIL` / `PASS` lines. Failed tests show expected vs received values.
- **Cypress**: Look for `✓` (pass) and `✗` (fail). Failed tests include screenshots in `cypress/screenshots/`.

## Workflow

1. Ask which test suite to run (backend, frontend, or both).
2. Execute the appropriate command or helper script.
3. Parse the output and summarize: total tests, passed, failed, skipped.
4. For failures: identify root cause, show the relevant code, and suggest a fix.
5. After fix: re-run to confirm.
```

> **About `argument-hint`:** This text appears as placeholder text in the chat input when you select the skill from the `/` menu, guiding the user on what to type.

#### Step 3 - Add supporting scripts

Create a `scripts/` subfolder inside the skill directory with helper scripts that the skill references. These scripts provide a one-command way to run all test suites sequentially.

1.  Create `bookfaves-qa-plugin/skills/test-runner/scripts/run-tests.sh`:

```bash
#!/bin/bash
# generated-by-copilot: helper script to run all test suites sequentially
set -e

echo "=== Running Backend Tests ==="
cd copilot-agent-and-mcp
npm run test:backend

echo ""
echo "=== Running Frontend E2E Tests ==="
npm run build:frontend && npm run test:frontend

echo ""
echo "=== All Tests Complete ==="
```

2.  Create `bookfaves-qa-plugin/skills/test-runner/scripts/run-tests.ps1`:

```powershell
# generated-by-copilot: helper script to run all test suites sequentially (Windows)
$ErrorActionPreference = "Stop"

Write-Host "=== Running Backend Tests ==="
Push-Location copilot-agent-and-mcp
npm run test:backend

Write-Host ""
Write-Host "=== Running Frontend E2E Tests ==="
npm run build:frontend; npm run test:frontend
Pop-Location

Write-Host ""
Write-Host "=== All Tests Complete ==="
```

> **How SKILL.md references scripts:** The SKILL.md body uses relative paths like `./scripts/run-tests.sh` to point to supporting files. When Copilot loads the skill, it can read these files to understand how to execute them. The script paths in the "Supporting Scripts" and "Available Test Commands" sections tell Copilot the exact commands to run.

The skill directory now looks like this:

```
bookfaves-qa-plugin/skills/test-runner/
├── SKILL.md                      # Skill instructions (loaded by Copilot)
└── scripts/
    ├── run-tests.sh              # Bash helper (Linux/macOS)
    └── run-tests.ps1             # PowerShell helper (Windows)
```

### Exercise 1.4 - Add the QA Reviewer Agent

Create an agent that reviews test coverage and quality without modifying files.

1.  Create the `bookfaves-qa-plugin/agents/` directory.
2.  Create `bookfaves-qa-plugin/agents/qa-reviewer.agent.md`:

```markdown
---
description: Review test coverage and quality for the Book Favorites app. Analyzes test files, identifies gaps, and suggests improvements without modifying code.
name: QA Reviewer
tools: ['search', 'search/codebase', 'search/usages']
---

# QA Review Instructions

You are a senior QA engineer specializing in test quality. You review test suites for coverage, reliability, and best practices.

Don't make any code edits, just review and report findings.

## Rules

1. Always start comments in the code with "generated-by-copilot: "
2. **NEVER edit, create, or delete files.** You are read-only.
3. Focus on the `copilot-agent-and-mcp/` directory for all analysis.
4. Backend tests are in `backend/tests/` (Jest).
5. Frontend E2E tests are in `cypress/e2e/` (Cypress).

## Review Checklist

For every review, check:

1. **Coverage gaps** - routes/components without corresponding tests
2. **Edge cases** - missing boundary conditions, error paths, empty states
3. **Test isolation** - tests that depend on shared state or execution order
4. **Assertion quality** - generic assertions (e.g., `toBeTruthy()`) vs. specific ones
5. **Mock usage** - over-mocking that hides real bugs
6. **Naming** - test descriptions that clearly explain what is being tested
7. **DRY** - duplicated setup that should use `beforeEach` / helpers

## Output Format

Produce a review report with:

- **Summary** - overall test health score (A/B/C/D/F) and one-line assessment
- **Coverage Map** - table showing each route/component and whether it has tests
- **Findings** - table with columns: Priority (P0-P3), File, Issue, Suggestion
- **Quick Wins** - top 3 easiest improvements with the highest impact
```

### Exercise 1.5 - Add the Post-Test Logger Hook

Create a hook that runs after test-related tool calls to log test results.

1.  Create the `bookfaves-qa-plugin/hooks/scripts/` directory.
2.  Create `bookfaves-qa-plugin/hooks/post-test-logger.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "node bookfaves-qa-plugin/hooks/scripts/log-test-results.js",
        "timeout": 10
      }
    ]
  }
}
```

3.  Create `bookfaves-qa-plugin/hooks/scripts/log-test-results.js`:

```javascript
// generated-by-copilot: PostToolUse hook to log test execution results
// Only fires for terminal tool calls that contain test commands.
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });
let inputData = '';

rl.on('line', (line) => {
  inputData += line;
});

rl.on('close', () => {
  try {
    const input = JSON.parse(inputData);
    const toolName = input.tool_name || '';
    const toolInput =
      typeof input.tool_input === 'string'
        ? JSON.parse(input.tool_input)
        : input.tool_input || {};

    // generated-by-copilot: only log for terminal commands that look like test runs
    const terminalTools = ['run_in_terminal', 'terminal', 'bash', 'shell'];
    if (!terminalTools.some((t) => toolName.toLowerCase().includes(t))) {
      process.exit(0);
    }

    const command = toolInput.command || toolInput.cmd || toolInput.input || '';
    const testPatterns = [/npm\s+run\s+test/i, /jest/i, /cypress/i, /vitest/i];

    if (!testPatterns.some((p) => p.test(command))) {
      process.exit(0);
    }

    // generated-by-copilot: log test execution with timestamp
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Test executed: ${command}\n`;
    process.stderr.write(logEntry);
  } catch (err) {
    process.stderr.write(`Test log hook error: ${err.message}\n`);
    process.exit(0);
  }
});
```

### Exercise 1.6 - Verify the Plugin Structure

Confirm your plugin has the complete structure:

```
bookfaves-qa-plugin/
├── plugin.json                        # Plugin metadata
├── skills/
│   └── test-runner/
│       ├── SKILL.md                   # Testing skill instructions
│       └── scripts/
│           ├── run-tests.sh           # Bash helper (Linux/macOS)
│           └── run-tests.ps1          # PowerShell helper (Windows)
├── agents/
│   └── qa-reviewer.agent.md           # QA review agent (read-only)
└── hooks/
    ├── post-test-logger.json          # PostToolUse hook config
    └── scripts/
        └── log-test-results.js        # Hook script for logging
```

Run a quick check from the workspace root:

```powershell
Get-ChildItem -Recurse bookfaves-qa-plugin | Select-Object FullName
```

**Verify:**

*   `plugin.json` exists with valid JSON and includes `name`, `displayName`, and `description`
*   `skills/test-runner/SKILL.md` has valid YAML frontmatter with `name`, `description`, and `argument-hint`
*   `skills/test-runner/scripts/run-tests.sh` and `run-tests.ps1` exist as supporting scripts
*   `agents/qa-reviewer.agent.md` has valid YAML frontmatter with `name`, `description`, and `tools`
*   `hooks/post-test-logger.json` has a valid `hooks.PostToolUse` array
*   `hooks/scripts/log-test-results.js` is valid JavaScript

### Exercise 1.7 - Install and Test the Plugin Locally

Register your plugin as a local plugin so VS Code loads its customizations.

1.  Open **Settings** (`Ctrl+,`).
2.  Search for `chat.plugins.paths`.
3.  Click **Add Item**:
    *   **Key:** the absolute path to your `bookfaves-qa-plugin/` directory (e.g., `C:/Users/yourname/Desktop/WS-GHCP/WS-AgenticDevOpsCopilotDeepDive/src/bookfaves-qa-plugin`)
    *   **Value:** `true` (to enable it)

Alternatively, add to your `settings.json`:

```json
{
  "chat.plugins.paths": {
    "C:/Users/yourname/Desktop/WS-GHCP/WS-AgenticDevOpsCopilotDeepDive/src/bookfaves-qa-plugin": true
  }
}
```

> **Note:** Use forward slashes in the path even on Windows. Adjust the path to match your actual workspace location.

Now verify each component of your plugin is active:

**Test the skill:**

1.  Open the Chat view.
2.  Type `/test-runner` and press Enter.
3.  Ask: "Run the backend tests for the Book Favorites app."
4.  Copilot should use the skill instructions and run `npm run test:backend` from the correct directory.

**Test the agent:**

1.  In the Chat view, check the **Agents** dropdown.
2.  The **QA Reviewer** agent should appear in the list (provided by the plugin).
3.  Select it and ask: "Review the test coverage for the Book Favorites app."
4.  The agent should analyze test files without modifying any code.

**Test the hook:**

1.  Use the default **Copilot** agent (Agent Mode).
2.  Ask: "Run `npm run test:backend` in the copilot-agent-and-mcp directory."
3.  Open the **Output** panel (`Ctrl+Shift+U`) and select **GitHub Copilot Chat Hooks**.
4.  Look for the `[PostToolUse]` log entry from the test logging hook.

**Verify:**

*   The `/test-runner` skill is available and loaded from the plugin
*   The **QA Reviewer** agent appears in the agents dropdown
*   The post-test hook fires when test commands are executed
*   All three components came from the plugin — not from `.github/` files

### Exercise 1.8 - Disable and Re-enable the Plugin

1.  Go to **Settings** > `chat.plugins.paths`.
2.  Change the value for your `bookfaves-qa-plugin` path from `true` to `false`.
3.  Verify: the **QA Reviewer** agent disappears from the dropdown, the `/test-runner` skill is no longer available, and the hook no longer fires.
4.  Change the value back to `true` and confirm everything reappears.

> **Tip:** This is how you toggle plugins on and off without uninstalling them — useful for debugging conflicts between plugin and local customizations.

---

## Part 2 - Configure Additional Marketplaces (5 min)

**Objective:** Learn how to add custom plugin marketplaces beyond the defaults, including private team repositories.

### Exercise 2.1 - Add a Custom Marketplace

Plugin marketplaces are Git repositories that contain plugin definitions. You can reference them in several formats:

| Format | Example |
| --- | --- |
| **Shorthand** | `owner/repo` (public GitHub repos) |
| **HTTPS** | `https://github.com/owner/repo.git` |
| **SSH** | `git@github.com:owner/repo.git` |
| **Local** | `file:///path/to/marketplace` |

1.  Open **Settings** (`Ctrl+,`).
2.  Search for `chat.plugins.marketplaces`.
3.  Click **Add Item** and enter a marketplace reference (e.g., `github/copilot-plugins` is already a default).

```json
{
  "chat.plugins.marketplaces": [
    "github/copilot-plugins",
    "github/awesome-copilot",
    "contoso/engineering-plugins"
  ]
}
```

> **Private repositories:** If a public lookup fails, VS Code falls back to cloning the repository directly. Private repos work as long as your Git credentials have access.

4.  After adding a marketplace, browse the **Extensions view** with `@agentPlugins` to see plugins from the new marketplace.

---

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Plugin UI not visible | Verify `chat.plugins.enabled` is `true` in settings |
| `@agentPlugins` returns nothing | Check your network connection; VS Code needs to reach GitHub to list marketplace plugins |
| Local plugin not loading | Verify the path in `chat.plugins.paths` is correct, uses forward slashes, and the value is `true` |
| Plugin agent not in dropdown | Reload VS Code (`Ctrl+Shift+P` > **Developer: Reload Window**) after changing plugin settings |
| Plugin hook not firing | Check that the hook script path in the `.json` config is correct relative to the workspace root |
| Conflict with local customizations | Disable the plugin (`chat.plugins.paths` → `false`) to verify; plugin and local customizations should coexist |
| `plugin.json` errors | Validate the JSON syntax; ensure `name` and `displayName` fields are present |

---

## Key Takeaways

| Concept | Key Learning |
| --- | --- |
| **Plugins = distribution** | Plugins solve how to share agents, skills, hooks, and MCP servers as a single installable package |
| **`plugin.json`** | The manifest that identifies the plugin with metadata (name, description, version, publisher) |
| **Bundled customizations** | A plugin can contain any combination of skills, agents, hooks, MCP servers, and slash commands |
| **Marketplaces** | Git repositories that host plugin definitions; configurable via `chat.plugins.marketplaces` |
| **Local plugins** | Register plugins from disk via `chat.plugins.paths` for development and testing |
| **Enable/disable** | Toggle plugins on/off without uninstalling by setting path value to `true`/`false` |
| **Security** | Always review plugin contents before installing — hooks and MCP servers run code on your machine |
| **Coexistence** | Plugins work alongside `.github/` customizations; both appear in the same menus |

## Reference

*   [VS Code Agent Plugins Documentation](https://code.visualstudio.com/docs/copilot/customization/agent-plugins)
*   [Customize AI for Your Project Guide](https://code.visualstudio.com/docs/copilot/guides/customize-copilot-guide)
*   [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
*   [Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
*   [Hooks](https://code.visualstudio.com/docs/copilot/customization/hooks)
*   [MCP Servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
