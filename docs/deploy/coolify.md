# Coolify & PaaS Deployment

Deploy Naagmani using [Coolify](https://coolify.io) or modern Nixpacks-based self-hosted PaaS platforms.

---

## Deployment Steps

1. In Coolify, create a new **Project** and add a **Service**.
2. Select **Docker Compose** or connect your private Git repository.
3. Set environment variables in the Coolify UI:
   - `DATABASE_URL`: Managed PostgreSQL connection string.
   - `REDIS_URL`: Managed Redis connection string.
   - `ENCRYPTION_MASTER_KEY`: 32-byte hex string for AES-256 BYOK vault.
4. Set health check paths:
   - Portal: `http://localhost:3000/api/health`
   - Gateway: `http://localhost:8080/health`
   - Cloud: `http://localhost:8081/health`
5. Click **Deploy**.

---

## Related Documentation

- [Docker Compose Deployment](file:///e:/project/naagmani-project/naagmani-docs/docs/deploy/docker-compose.md)
