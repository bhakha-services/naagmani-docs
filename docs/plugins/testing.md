# Testing & Validation

Testing your plugins prior to deployment prevents latency spikes, memory leaks, and pipeline failures.

---

## 1. Unit Testing with HDK Mock Suite

The Go HDK provides an in-memory testing harness to simulate gateway invocations:

```go
package main

import (
	"context"
	"testing"
	"github.com/naagmani/naagmani-hdk-go/testing/harness"
	"github.com/stretchr/testify/assert"
)

func TestEmailRedaction(t *testing.T) {
	h := harness.New(myPreRouteHandler)

	resp, err := h.ExecutePreRoute(context.Background(), &plugin.PreRouteRequest{
		Messages: []plugin.Message{
			{Role: "user", Content: "Contact me at alice@naagmani.app"},
		},
	})

	assert.NoError(t, err)
	assert.Equal(t, "[REDACTED_EMAIL]", resp.Messages[0].Content)
}
```

---

## 2. CLI Benchmark & Latency Testing

Use the CLI to test execution speed under load:

```bash
naagmani plugins benchmark ./ --concurrency 50 --requests 1000
# Output:
# ── Benchmark Summary ──────────────────────────
#   Total Invocations:   1,000
#   p50 Latency:         0.45 ms
#   p95 Latency:         0.92 ms
#   p99 Latency:         1.21 ms
#   Memory Footprint:    12.4 MB
#   Status:              PASS (meets < 2ms criteria)
```

---

## Next Steps

- [Packaging & Publishing](/docs/plugins/publishing)
- [Marketplace Installation](/docs/marketplace/installing-plugins)
