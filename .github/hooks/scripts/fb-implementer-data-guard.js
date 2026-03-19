// generated-by-copilot: PreToolUse hook to block FB Implementer from editing backend/data/ files
// Reads tool input from stdin (JSON) and denies file edits targeting backend/data/.
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

    // generated-by-copilot: only check file edit tools
    const editTools = [
      'editFiles',
      'createFiles',
      'create_file',
      'replace_string_in_file',
      'multi_replace_string_in_file',
      'edit_notebook_file',
    ];
    if (!editTools.some((t) => toolName.includes(t))) {
      process.stdout.write(JSON.stringify({ continue: true }));
      process.exit(0);
    }

    // generated-by-copilot: tool_input may arrive as a JSON string — parse if needed
    let toolInput = input.tool_input;
    if (typeof toolInput === 'string') {
      try {
        toolInput = JSON.parse(toolInput);
      } catch {
        toolInput = {};
      }
    }
    toolInput = toolInput || {};

    // generated-by-copilot: extract file path and normalize Windows backslashes
    const filePath = (toolInput.filePath || toolInput.file_path || '')
      .replace(/\\/g, '/');

    if (filePath.includes('backend/data/')) {
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'deny',
            permissionDecisionReason: `FB Implementer cannot modify backend/data/ files (${filePath}). Please use the Database Migrator agent for schema changes and data modifications.`,
          },
        })
      );
      process.exit(0);
    }

    // generated-by-copilot: file is outside backend/data/, allow the edit
    process.stdout.write(JSON.stringify({ continue: true }));
    process.exit(0);
  } catch (err) {
    process.stderr.write(`FB Implementer data guard error: ${err.message}\n`);
    process.exit(1);
  }
});
