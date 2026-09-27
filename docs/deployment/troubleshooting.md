# Troubleshooting & Diagnostics Guide

This guide provides actionable solutions for diagnosing, debugging, and resolving common deployment and runtime issues in **Naagmani AI OS**.

---

## 1. Automated Diagnostics (`doctor`)

Before manual troubleshooting, run the built-in diagnostic engine:

```bash
naagmani platform doctor
```

The diagnostic engine inspects:
- Host operating system, CPU architecture, memory, and disk space
- Docker engine and Docker Compose version and daemon responsiveness
- Port availability (`3000`, `8081`)
- Outbound network access to GitHub Container Registry (`ghcr.io`) and DNS resolution
- Active container health probes and response codes for `postgres`, `redis`, `naagmani-os`, `naagmani-cloud`, and `naagmani-developer`
- Installation state machine status and identity file validity

---

## 2. Common Issues & Remediations

### Issue 1: Port Conflict on Port 3000 or 8081

**Symptom:**
```text
✖ Portal Port:     Port 3000 Available      (detected: Port 3000 In Use)
Error: preflight verification failed.
```

**Cause:** Another application (e.g. Node.js app, Grafana, NGINX) is already listening on the requested port.

**Remediation:**
1. Identify the process using the port:
   ```bash
   # Linux / macOS
   sudo lsof -i :3000
   sudo ss -tulpn | grep 3000
   ```
2. Either terminate the conflicting process or install Naagmani on an alternative port:
   ```bash
   naagmani platform install --port-portal 3005 --port-cloud 8085
   ```

---

### Issue 2: Docker Daemon Not Running / Permission Denied

**Symptom:**
```text
✖ Docker Daemon:   Active / Running         (detected: Not Accessible)
Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock.
```

**Remediation:**
1. Verify the Docker service status:
   ```bash
   sudo systemctl status docker
   ```
2. Start the Docker daemon:
   ```bash
   sudo systemctl start docker
   ```
3. If running as a non-root user, ensure your user is in the `docker` group:
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

---

### Issue 3: Stale Installation Lock

**Symptom:**
```text
Error: installation is already in progress by PID 12345 (started at 2026-09-27T08:00:00Z).
```

**Cause:** A prior installation was forcibly terminated or the host rebooted mid-installation.

**Remediation:**
The installer automatically inspects PID liveness. If the previous process has died, rerun with `--force` to reclaim the lock:
```bash
naagmani platform install --force
```

---

### Issue 4: PostgreSQL Health Check Timeout

**Symptom:**
```text
✖ Waiting for PostgreSQL to become healthy: timed out after 30s.
```

**Possible Causes:**
- Insufficient disk space on the Docker volume mount
- Corrupted database state from an improper shutdown
- System resource starvation (RAM exhaustion)

**Remediation:**
1. Check the PostgreSQL container logs:
   ```bash
   naagmani platform logs --service postgres
   ```
2. Verify available disk space:
   ```bash
   df -h /var/lib/docker
   ```
3. Test manual connectivity to PostgreSQL within the Docker network:
   ```bash
   docker exec -it naagmani-postgres pg_isready -U postgres
   ```

---

### Issue 5: Cloud API Unhealthy or CORS Errors

**Symptom:** Developer Portal UI shows "Network Error" or "Unable to reach Naagmani Cloud".

**Remediation:**
1. Check Cloud Control Plane logs:
   ```bash
   naagmani platform logs --service cloud
   ```
2. Check if the `PORTAL_BASE_URL` and `NAAGMANI_CORS_ALLOWED_ORIGINS` in `.env` match your browser's access URL:
   ```bash
   cat .env | grep CORS
   ```
3. Restart the services after updating `.env`:
   ```bash
   naagmani platform restart
   ```

---

## 3. Log Inspection

Access streaming or tailed logs across any service:

```bash
# Follow logs for all services in real time
naagmani platform logs -f

# Filter by specific service
naagmani platform logs -f --service os
naagmani platform logs -f --service cloud
naagmani platform logs -f --service portal
naagmani platform logs -f --service postgres
naagmani platform logs -f --service redis

# View historical installer lifecycle logs
cat .naagmani/install.log
```

---

## 4. Recovering from Interrupted Installation

If network disconnection or power failure interrupts an installation:
1. Re-run the installation command with the same directory:
   ```bash
   naagmani platform install --dir /opt/naagmani
   ```
2. The installer inspects `.naagmani/install_state.json`, preserves previously generated cryptographic secrets and the installation ID (`inst_xxx`), and resumes from the last incomplete stage.
