# Node.js & TypeScript SDK

The **Naagmani Node.js SDK** (`@naagmani/sdk`) delivers typed TypeScript definitions, complete OpenAI client drop-in compatibility, and full support for both browser and Node.js runtimes.

---

## Installation

```bash
npm install @naagmani/sdk
# or
pnpm add @naagmani/sdk
# or
yarn add @naagmani/sdk
```

---

## 1. Basic Chat Completion

```typescript
import { Naagmani } from '@naagmani/sdk';

const naagmani = new Naagmani({
  apiKey: process.env.NAAGMANI_SERVICE_TOKEN || 'nst_live_9b2d8819...',
  baseURL: 'http://localhost:8080/v1', // or https://gateway.naagmani.app/v1
});

async function run() {
  const completion = await naagmani.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an expert TypeScript architect.' },
      { role: 'user', content: 'What are branded types in TypeScript?' }
    ],
    temperature: 0.5,
  });

  console.log(completion.choices[0].message.content);
  console.log('Attempt Trace ID:', completion.system_fingerprint);
}

run().catch(console.error);
```

---

## 2. Server-Sent Events (SSE) Streaming

```typescript
const stream = await naagmani.chat.completions.create({
  model: 'claude-3-5-sonnet-20241022',
  messages: [{ role: 'user', content: 'Write a Fibonacci sequence function.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

---

## 3. Drop-in OpenAI Compatibility

If your application already uses the official `openai` npm package, you only need to change the `baseURL` and `apiKey`:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'nst_live_9b2d8819...',
  baseURL: 'http://localhost:8080/v1',
});

// All standard methods work seamlessly with Naagmani Smart Routing!
const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello Naagmani!' }],
});
```

---

## Next Steps

- [Python SDK](/docs/sdk/python)
- [Go SDK](/docs/sdk/go)
