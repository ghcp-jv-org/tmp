#!/usr/bin/env node
// generated-by-copilot: Main entry point for book-database MCP server (stdio transport)

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerBookTools } from "./tools/book-tools.js";

const server = new McpServer({
  name: "book-database-mcp-server",
  version: "1.0.0",
});

registerBookTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("book-database-mcp-server running via stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
