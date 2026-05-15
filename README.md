# Smart System Automation & Monitoring Suite

## Project Overview

A professional two-part automation framework:

| Part | Technology | Purpose |
|------|-----------|---------|
| **Application 1** | Linux Bash Scripts + Cron | System monitoring, backup, maintenance, reporting |
| **Application 2** | Python 3 | Interactive file & directory management with analytics |

---

## Repository Structure

```
Scripting Workshop/
│
├── linux_automation/
│   ├── scripts/
│   │   ├── system_monitor.sh       # CPU, memory, disk, network capture
│   │   ├── backup_sync.sh          # tar.gz archival + rsync mirroring
│   │   ├── system_maintenance.sh   # OS updates, cleanup, journal vacuum
│   │   ├── generate_report.sh      # HTML + plain-text summary report
│   │   └── setup_cron.sh           # One-shot cron installer
│   ├── logs/                       # Rolling 3-day log files (auto-created)
│   ├── backups/                    # Archives + synced mirrors (auto-created)
│   └── reports/                    # Generated HTML/TXT reports (auto-created)
│
├── python_automation/
│   ├── main.py                     # Entry point — interactive menu loop
│   ├── directory_manager.py        # Registry with file counts & timestamps
│   ├── file_operations.py          # Organise, rename, move, copy, remove, dedup
│   ├── analytics.py                # Log parsing, insights, ASCII charts
│   ├── logger.py                   # Console + rotating file + JSON logging
│   ├── data/                       # registry.json persisted here
│   ├── logs/                       # Python log files (3-day rotation)
│   └── reports/                    # Analytics TXT reports
│
└── README.md
```

---

## Application 1 — Linux Automation System

### Quick Start (Linux / WSL)

```bash
# 1. Navigate to the scripts directory
cd linux_automation/scripts

# 2. Make all scripts executable
chmod +x *.sh

# 3. Install cron jobs (one-time setup)
./setup_cron.sh

# 4. Verify cron jobs are installed
crontab -l

# 5. Run scripts manually for immediate output
./system_monitor.sh
./backup_sync.sh
./system_maintenance.sh
./generate_report.sh
```

### Cron Schedule

| Script | Schedule | Description |
|--------|----------|-------------|
| `system_monitor.sh` | `*/15 * * * *` | Every 15 minutes |
| `backup_sync.sh` | `0 2 * * *` | Daily at 02:00 AM |
| `system_maintenance.sh` | `0 3 * * 0` | Every Sunday 03:00 AM |
| `generate_report.sh` | `0 6 * * *` | Daily at 06:00 AM |

### Cron Syntax Reference

```
┌───────── minute        (0–59)
│ ┌─────── hour          (0–23)
│ │ ┌───── day of month  (1–31)
│ │ │ ┌─── month         (1–12)
│ │ │ │ ┌─ day of week   (0–7, 0/7 = Sunday)
│ │ │ │ │
* * * * *   command
```

### Log Retention

All logs are rotated automatically — only the **last 3 days** are kept:

```bash
# Manual cleanup (also done automatically by system_monitor.sh)
find linux_automation/logs -name "*.log" -mtime +2 -delete
```

---

## Application 2 — Python Automation System

### Requirements

- Python 3.10 or later (uses `match` syntax via walrus operator `while chunk :=`)
- No external packages required — stdlib only

### Quick Start

```bash
cd python_automation
python main.py
```

### Menu Structure

```
MAIN MENU
  1  Directory Management
       ├─ Add / Remove a directory
       ├─ Refresh / rescan
       └─ View status table (path, file count, size, last modified)
  2  File Operations
       ├─ Organise files by extension → sub-folders
       ├─ Batch rename (prefix / suffix / counter / replace)
       ├─ Move files (glob pattern)
       ├─ Copy files (glob pattern)
       ├─ Remove files (dry-run first!)
       └─ Find duplicate files (MD5)
  3  Analytics & Reports
       ├─ Full report (hourly heatmap, action freq, error stats)
       └─ Quick 24-hour dashboard
  4  System Information
       └─ OS info, log locations, cron reference
  0  Exit
```

### Key Design Features

| Feature | Implementation |
|---------|---------------|
| **Persistence** | `data/registry.json` survives restarts |
| **Log rotation** | `TimedRotatingFileHandler` — midnight, 3-day backupCount |
| **JSON events log** | Machine-readable for analytics parsing |
| **Dry-run delete** | Remove files only after explicit confirmation |
| **Duplicate detection** | MD5 chunked hashing — handles files of any size |
| **Error resilience** | All exceptions caught + logged; app never crashes |
| **Cross-platform** | Runs on Linux, macOS, and Windows |

---

## Key Commands Explained

### Linux Scripts

| Command | Purpose |
|---------|---------|
| `ps aux --sort=-%cpu` | List all processes sorted by CPU descending |
| `free -h` | Human-readable RAM stats |
| `df -hT` | Disk usage with filesystem type |
| `ss -tulnp` | TCP/UDP listening sockets |
| `top -b -n 1` | One-shot text snapshot of running processes |
| `tar -czf` | Create gzip-compressed archive |
| `rsync -avz --delete` | Mirror source to destination |
| `find -mtime +2 -delete` | Remove files older than 2 days |
| `journalctl --vacuum-time=3d` | Trim system journal to 3 days |
| `apt-get upgrade -y` | Non-interactive system update |

### Python Modules

| Module | stdlib class/function | Purpose |
|--------|----------------------|---------|
| `logger.py` | `TimedRotatingFileHandler` | Rotating log with 3-day retention |
| `logger.py` | Custom `JSONFormatter` | NDJSON log for analytics |
| `directory_manager.py` | `os.walk`, `os.stat` | Directory tree statistics |
| `file_operations.py` | `shutil.move`, `shutil.copy2` | File move/copy with metadata |
| `file_operations.py` | `fnmatch.fnmatch` | Glob pattern matching |
| `file_operations.py` | `hashlib.md5` | Chunked file hashing |
| `analytics.py` | `collections.Counter` | Event frequency counting |

---

## Generated Output Files

After running the suite, the following output files are produced:

```
linux_automation/
  logs/
    monitor_YYYY-MM-DD.log       # System resource snapshots
    backup_YYYY-MM-DD.log        # Backup activity log
    maint_YYYY-MM-DD.log         # Maintenance events
  reports/
    summary_report_YYYY-MM-DD.txt   # Plain-text summary
    summary_report_YYYY-MM-DD.html  # Styled HTML report

python_automation/
  logs/
    automation.log               # Human-readable app log
    automation_events.json       # Machine-readable NDJSON events
  data/
    registry.json                # Directory registry
  reports/
    analytics_YYYY-MM-DD_HHmmss.txt  # Analytics insights report
```

---

## Submission Checklist

- [x] Full source code — Linux shell scripts (4 scripts)
- [x] Full source code — Python application (4 modules + entry point)
- [x] Cron scheduling — `setup_cron.sh` installs all 4 jobs
- [x] 3-day log retention — enforced in both applications
- [x] Detailed command explanations — inline in every script
- [x] Robust error handling — zero crash policy in Python app
- [x] Analytics module — heatmap, frequency, error stats, trends
- [x] HTML report — styled summary from `generate_report.sh`
