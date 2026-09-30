# 🐳 Docker Backup Relay

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://hub.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Binance Pay](https://img.shields.io/badge/Binance%20Pay-UID%201049392123-F0B90B.svg?style=flat-square&logo=binance&logoColor=white)](#-pro-enterprise-license--binance-pay)
[![CI Tests](https://github.com/Shokun123/docker-backup-relay/actions/workflows/ci.yml/badge.svg)](https://github.com/Shokun123/docker-backup-relay/actions)

> **Zero-config automated database backup, gzip compression & encrypted Telegram/S3 dispatch in Docker.**  
> Effortlessly protect PostgreSQL, SQLite, MySQL, and static directories on your VPS or homelab without paying monthly fees for heavy enterprise SaaS backup tools.

---

## ⚡ Quick Start in 60 Seconds

### Using Docker Compose

```yaml
version: '3.8'

services:
  backup-relay:
    image: node:22-alpine
    container_name: docker-backup-relay
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - TARGET_NAME=Production Database
      - BACKUP_DIR=/data/backups
      - ENCRYPTION_PASSWORD=my_super_secret_key
      # Optional: Add Binance Pay TxID to unlock Pro AES-256-GCM
      - LICENSE_KEY=1049392123
    volumes:
      - ./backups:/data/backups
```

Run in terminal:
```bash
docker compose up -d
```

### Run Locally with Node.js
```bash
git clone https://github.com/Shokun123/docker-backup-relay.git
cd docker-backup-relay
npm start
```

---

## 🛠️ Environment Variables & Configuration

| Variable | Default | Description |
| :--- | :---: | :--- |
| `PORT` | `8080` | Port for HTTP health checks and manual trigger API. |
| `TARGET_NAME` | `Primary Database` | Name of the database/service being protected. |
| `BACKUP_DIR` | `./backups` | Directory where compressed backup files are saved. |
| `ENCRYPTION_PASSWORD` | `""` | Passphrase for AES-256-GCM hardware encryption. |
| `LICENSE_KEY` | `""` | Pro License Key or Binance Pay TxID (`UID: 1049392123`). |
| `TELEGRAM_BOT_TOKEN` | `""` | Optional Telegram bot token for instant alert dispatches. |
| `TELEGRAM_CHAT_ID` | `""` | Telegram chat ID to receive backup reports and files. |

---

## 📡 Built-In REST API Endpoints

- **`GET /health`** — Returns system uptime, last backup timestamp, size, and encryption status.
- **`POST /backup/trigger`** — Manually triggers an immediate backup routine on demand.

---

## 💎 Pro Enterprise License & Binance Pay

The **Community Edition** is free and open-source under the MIT license with automated GZIP compression and local retention.

### 🌟 Pro Features ($25 USDT Lifetime License):
* **Military-Grade AES-256-GCM Encryption:** Encrypt dumps before storage or transmission.
* **Direct Telegram & Cloudflare R2 / S3 Multi-Cloud Dispatch.**
* **Automatic Retention Pruning:** Automatically purges backups older than 30 days.

### How to Activate Pro:
1. Send **$25 USDT** via **Binance Pay** to:
   - **Binance UID:** `1049392123`
   - **Username:** `User-79a91`
   - **Networks:** BNB Smart Chain (BEP20) or Polygon Network.
2. Set your Binance TxID or Pay ID as `LICENSE_KEY` in your `docker-compose.yml`:
   ```yaml
   environment:
     - LICENSE_KEY=1049392123
   ```

---

## 🌐 The Shokun123 Developer Suite

* ⚡ **[Binance Pay SaaS Starter](https://github.com/Shokun123/binance-pay-saas-starter)** — Micro-SaaS Boilerplate with zero-fee crypto payments.
* 🏛️ **[Awesome System Architecture & AI Prompts](https://github.com/Shokun123/awesome-system-architecture-ai)** — Curated system design blueprints and AI prompts.
* 💻 **[AI Commit Generator for VS Code](https://github.com/Shokun123/vscode-ai-commit-generator)** — Conventional commit generator for VS Code.
* 🔍 **[AI PR Code Reviewer](https://github.com/Shokun123/ai-pr-reviewer-action)** — GitHub Action for secret leak prevention and OWASP audits.
* 🗺️ **[Google Maps B2B Lead Extractor](https://github.com/Shokun123/google-maps-b2b-lead-scraper)** — High-performance Apify Actor for automated B2B lead generation.
* 🛡️ **[LeadRescue AI](https://shokun123.github.io/leadrescue-ai/)** — Interactive Speed-to-Lead conversion audit & lead routing.

---

## 📄 License

Distributed under the **MIT License**. Free for open-source and individual developers.
