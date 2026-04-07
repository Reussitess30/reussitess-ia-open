def detect_weakness(text):
    issues = []

    if not text or len(text.strip()) < 20:
        issues.append("too_short")

    if "Pas d'information" in text:
        issues.append("missing_data")

    if "je ne dispose pas" in text.lower():
        issues.append("weak_answer")

    if "..." in text:
        issues.append("incomplete")

    return issues
