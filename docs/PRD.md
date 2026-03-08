# PROJECT: AyrisVult

## Vision
AyrisVult is a premium, self-hosted database management and backup SaaS. It enables developers to monitor, backup, and restore any database container running on their server with a zero-trust, encrypted workflow.

## Core Logic
- **Docker Orchestration:** Connects to /var/run/docker.sock to command peer containers.
- **Fullstack Next.js:** Unified codebase for management UI and background backup tasks.
- **Encrypted Vaults:** Backups are GPG encrypted before being sent to off-site locations (Gitea, Telegram, S3).
