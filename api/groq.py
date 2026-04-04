import os
import json

CACHE_FILE = os.path.expanduser("~/reussitess-global-nexus/groq_cache.json")

with open(CACHE_FILE, 'r', encoding='utf-8') as f:
    cache = json.load(f)

def handle_prompt(prompt):
    prompt_lower = prompt.lower()
    if "mali" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("empire_mali", "")
    elif "ashanti" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("empire_ashanti", "")
    elif "zulu" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("empire_zulu", "")
    elif "artisanat" in prompt_lower or "savoirs" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("artisanat", "")
    elif "mythes" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("mythes", "")
    elif "festivals" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("festivals", "")
    elif "langues" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("langues", "")
    elif "plantes" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("plantes_medicinales", "")
    elif "musiques" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("musiques", "")
    elif "reseau" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("reseau", "")
    elif "histoires" in prompt_lower or "liberation" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("histoires_resistance", "")
    elif "biographie" in prompt_lower:
        result = cache.get("afrocaraibeen_knowledge", {}).get("biographies", "")
    else:
        result = "⚠️ Info non disponible"
    return result
