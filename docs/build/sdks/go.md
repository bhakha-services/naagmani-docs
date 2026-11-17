# Go client

This example uses Go's standard `net/http` and `encoding/json` packages.

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "log"
    "net/http"
    "os"
    "strings"
    "time"
)

func main() {
    body, err := json.Marshal(map[string]any{
        "model": os.Getenv("NAAGMANI_MODEL"),
        "messages": []map[string]string{{"role": "user", "content": "Hello"}},
    })
    if err != nil { log.Fatal(err) }
    base := strings.TrimRight(os.Getenv("NAAGMANI_GATEWAY_URL"), "/")
    req, err := http.NewRequest(http.MethodPost, base+"/v1/chat/completions", bytes.NewReader(body))
    if err != nil { log.Fatal(err) }
    req.Header.Set("Authorization", "Bearer "+os.Getenv("NAAGMANI_API_KEY"))
    req.Header.Set("Content-Type", "application/json")
    client := &http.Client{Timeout: 60 * time.Second}
    res, err := client.Do(req)
    if err != nil { log.Fatal(err) }
    defer res.Body.Close()
    if res.StatusCode != http.StatusOK { log.Fatalf("gateway returned HTTP %d", res.StatusCode) }
    data, err := io.ReadAll(res.Body)
    if err != nil { log.Fatal(err) }
    fmt.Println(string(data))
}
```

Set `NAAGMANI_GATEWAY_URL` to the gateway origin without `/v1`, plus `NAAGMANI_API_KEY` and `NAAGMANI_MODEL`. Use an application credential with inference permission.

See [streaming](/api/streaming) and [authentication](/api/authentication).
