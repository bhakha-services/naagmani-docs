# Node.js client

This server-side example uses the built-in `fetch` API in Node.js 18 or later.

```javascript
const base = process.env.NAAGMANI_GATEWAY_URL.replace(/\/$/, '');
const response = await fetch(base + '/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + process.env.NAAGMANI_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: process.env.NAAGMANI_MODEL,
    messages: [{ role: 'user', content: 'Hello' }],
  }),
});
if (!response.ok) throw new Error('Gateway returned HTTP ' + response.status);
const result = await response.json();
console.log(result.choices[0].message.content);
```

Set `NAAGMANI_GATEWAY_URL` to the gateway origin (for example `http://localhost:8080`, without `/v1`), `NAAGMANI_API_KEY` to your application credential and `NAAGMANI_MODEL` to a configured model/policy. Run the example as an ES module. Never expose the credential in client-side JavaScript.

See [streaming](/api/streaming) and [authentication](/api/authentication).
