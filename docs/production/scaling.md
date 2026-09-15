# Scaling & High Concurrency

Naagmani is built for extreme throughput and low latency, capable of processing tens of thousands of concurrent AI streams with minimal CPU and memory overhead.

---

## Horizontal Gateway Scaling

The Naagmani Gateway is stateless:
- **Stateless Gateway Pods**: Deploy multiple gateway instances behind a standard Layer 7 load balancer (e.g. AWS ALB, NGINX, Cloudflare).
- **Distributed Cache / Rate Limiter**: Shared rate limits and token buckets are synchronized across gateway nodes using an in-memory Redis cluster.

---

## Horizontal Pod Autoscaler (HPA) Example

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: naagmani-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: naagmani-gateway
  minReplicas: 3
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000m"
```

---

## Memory & Socket Tuning

For high concurrency deployments:
- Set open file descriptor limits (`ulimit -n 65535`).
- Ensure keep-alive connection pooling is enabled between the gateway and upstream providers to eliminate TCP handshake latency.
