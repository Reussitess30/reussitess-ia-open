
from datetime import datetime

def log_question(q):
    with open("logs.txt","a") as f:
        f.write(f"{datetime.now()} | {q}\n")

