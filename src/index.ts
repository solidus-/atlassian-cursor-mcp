import { MCPServer } from '@modelcontextprotocol/sdk';
import express from 'express';
import dotenv from 'dotenv';
import { jiraTools } from './mcp/jiraTools';
import { confluenceTools } from './mcp/confluenceTools';
import { bitbucketTools } from './mcp/bitbucketTools';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Create MCP server
const mcpServer = new MCPServer({
  name: 'Atlassian MCP',
  description: 'Managed Code Plugin for Cursor IDE to integrate with Atlassian products (JIRA, Confluence, BitBucket)',
  version: '1.0.0',
  tools: [...jiraTools, ...confluenceTools, ...bitbucketTools],
});

// Mount MCP server to Express app
app.use('/mcp', mcpServer.handler());

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Atlassian MCP server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Atlassian MCP server is running on port ${port}`);
  console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  console.log(`Health check: http://localhost:${port}/health`);
});