# Capacity planning

Measure your own workload before selecting instance size, replica count or concurrency limits. Request size, stream duration, tool/agent work, plugin execution, provider latency and logging policy all affect resource use.

The gateway is not completely stateless: deployments have databases, cache/state dependencies, installation identity, licenses and potentially plugin/agent data. Review these dependencies before adding replicas. Shared encryption keys and scoped state must be configured consistently without leaking tenant context.

For load tests, measure memory/CPU, open connections, file descriptors, database connection usage, Redis pressure, queue depth, error rates and tail latency. Test sustained traffic and upstream outages. There is no fixed RAM-per-connection or supported-concurrency number promised by this guide.

See [reliability](/production/reliability), [observability](/production/observability) and [rate limits](/production/rate-limits).
