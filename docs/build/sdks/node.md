# Node.js & TypeScript SDK

Official TypeScript client library for consuming Naagmani APIs in Node.js, Next.js, and browser environments.

---

## Installation

```bash
npm install @naagmani/sdk
# or
yarn add @naagmani/sdk
# or
pnpm add @naagmani/sdk
```

---

## Initialization

```typescript
import { Naagmani } from '@naagmani/sdk';

const naagmani = new Naagmani({
  apiKey: process.env.NAAGMANI_API_KEY, // Or Project Service Token (nsk_...)
  baseURL: process.env.NAAGMANI_BASE_URL || 'http://localhost:8080/v1',
});
```

---

## Chat Completions

```typescript
async function main() {
  const response = await naagmani.chat.completions.create({
    model: 'smart', // Targets your 'smart' Routing Policy
    messages: [
      { role: 'system', content: 'You are an enterprise AI assistant.' },
      { role: 'user', content: 'Explain zero-downtime key rotation.' },
    ],
    temperature: 0.7,
  });

  console.log(response.choices[0].message.content);
}

main();
```

---

## Real-Time Streaming (SSE)

```typescript
async function streamResponse() {
  const stream = await naagmani.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: 'Generate a 10-step deployment plan.' }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
}

streamResponse();
```

---

## Tool Calling (Function Calling)

```typescript
const response = await naagmani.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'What is the stock price of Apple?' }],
  tools: [
    {
      type: 'function',
      function: {
        name: 'get_stock_price',
        description: 'Get real-time stock ticker price',
        parameters: {
          type: 'object',
          properties: {
            ticker: { type: 'string', description: 'Stock symbol, e.g. AAPL' },
          },
          required: ['ticker'],
        },
      },
    },
  ],
});
```

---

## Error Handling

```typescript
import { NaagmaniError, RateLimitError, QuotaExceededError } from '@naagmani/sdk';

try {
  const res = await naagmani.chat.completions.create({ model: 'smart', messages: [...] });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error('RPM limit exceeded:', error.message);
  } else if (error instanceof QuotaExceededError) {
    console.error('Project budget reached:', error.message);
  } else if (error instanceof NaagmaniError) {
    console.error(`API Error (${error.status}):`, error.message);
  }
}
```

---

## Related Documentation

- [Chat Completions API Reference](file:///e:/project/naagmani-project/naagmani-docs/docs/api/chat-completions.md)
- [Project Service Tokens](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/projects/service-tokens.md)
