import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

let mcpClient = null;
let transport = null;
let isConnected = false;
let connectingPromise = null;

export async function connectMcp() {
  if (isConnected && mcpClient) return mcpClient;
  if (connectingPromise) return connectingPromise;

  connectingPromise = (async () => {
    try {
      const mcpUrl = localStorage.getItem('mcp_url') || 'http://localhost:8000/mcp';
      console.log(`[MCP] Connecting to SSE at ${mcpUrl}...`);

      transport = new SSEClientTransport(new URL(mcpUrl));

      mcpClient = new Client({
        name: "linkedin-assistant-web-client",
        version: "1.0.0"
      }, {
        capabilities: {}
      });

      await mcpClient.connect(transport);
      isConnected = true;
      console.log("[MCP] Connected successfully.");
      return mcpClient;
    } catch (error) {
      console.error("[MCP] Connection error:", error);
      isConnected = false;
      mcpClient = null;
      transport = null;
      throw error;
    } finally {
      connectingPromise = null;
    }
  })();

  return connectingPromise;
}

export async function listMcpTools() {
  try {
    const client = await connectMcp();
    const response = await client.listTools();
    return response.tools;
  } catch (error) {
    console.error("[MCP] Error listing tools:", error);
    return [];
  }
}

export async function callMcpTool(name, args) {
  try {
    const client = await connectMcp();
    console.log(`[MCP] Calling tool ${name} with args:`, args);
    const result = await client.callTool({
      name,
      arguments: args
    });
    console.log(`[MCP] Tool ${name} result:`, result);
    return result;
  } catch (error) {
    console.error(`[MCP] Error calling tool ${name}:`, error);
    throw error;
  }
}

export function disconnectMcp() {
  if (transport) {
    try {
      transport.close();
    } catch (e) {
      console.error("Error closing transport", e);
    }
  }
  isConnected = false;
  mcpClient = null;
  transport = null;
  console.log("[MCP] Disconnected.");
}
