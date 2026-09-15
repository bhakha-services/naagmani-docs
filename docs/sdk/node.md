# Node.js / TypeScript HDK (`@naagmani/hdk`)

The official Node.js / TypeScript HDK provides ergonomic async/await bindings, type definitions, and standard stream handling for building Naagmani plugins.

---

## Installation

```bash
npm install @naagmani/hdk
# or
yarn add @naagmani/hdk
# or
pnpm add @naagmani/hdk
```

---

## Quick Example (TypeScript)

```typescript
import { 
  Plugin, 
  HookContext, 
  PrePromptPayload, 
  HookResult,
  PostGenerationPayload
} from "@naagmani/hdk";

const plugin = new Plugin({
  name: "security-guard",
  version: "1.0.0"
});

// Pre-prompt hook
plugin.onPrePrompt(async (context: HookContext, payload: PrePromptPayload): Promise<HookResult> => {
  context.log.info(`Processing request ${context.requestId}`);
  
  // Transform or validate input
  return {
    status: "ok",
    action: "pass"
  };
});

// Post-generation hook
plugin.onPostGeneration(async (context: HookContext, payload: PostGenerationPayload): Promise<HookResult> => {
  // Check generated output
  return {
    status: "ok",
    action: "pass"
  };
});

plugin.start();
```

---

## Logging & Diagnostics

Never use `console.log()` inside a plugin, as stdout is reserved for JSON-RPC messages. Instead, use the structured logger provided on `context.log` (which writes to `stderr`):

```typescript
context.log.info("Processing completed successfully", { tokenCount: 42 });
context.log.error("Failed to connect to external vector DB", { err });
```
