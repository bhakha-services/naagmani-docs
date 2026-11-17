# Python client

This server-side example uses Python's standard library; no Naagmani-specific client package is required.

```python
import json
import os
import urllib.request

base = os.environ["NAAGMANI_GATEWAY_URL"].rstrip("/")
body = json.dumps({
    "model": os.environ["NAAGMANI_MODEL"],
    "messages": [{"role": "user", "content": "Hello"}],
}).encode("utf-8")
request = urllib.request.Request(
    base + "/v1/chat/completions",
    data=body,
    headers={
        "Authorization": "Bearer " + os.environ["NAAGMANI_API_KEY"],
        "Content-Type": "application/json",
    },
    method="POST",
)
with urllib.request.urlopen(request, timeout=60) as response:
    result = json.load(response)
print(result["choices"][0]["message"]["content"])
```

Set the gateway origin, application credential and configured model in those environment variables. The gateway origin should not include `/v1`; the example adds the request path. Handle HTTP/network failures in your application.

See [streaming](/api/streaming) and [authentication](/api/authentication).
