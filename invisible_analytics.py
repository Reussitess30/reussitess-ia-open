#!/usr/bin/env python3
import json
from datetime import datetime

def log_stats():
    stats = {
        "project": "REUSSITESS©",
        "origin": "Guadeloupe",
        "last_ping": datetime.now().isoformat(),
        "status": "Tracking Active (No Cookies)"
    }
    with open(".analytics_data.json", "w") as f:
        json.dump(stats, f, indent=2)
    print("📊 Analytics: Data Saved.")

if __name__ == "__main__":
    log_stats()
