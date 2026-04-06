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
    elif "donnée ajoutée" in prompt.lower():
        with open(CACHE_FILE, "r+", encoding="utf-8") as f:
            data = json.load(f)
            data.setdefault("user_contributions", []).append(prompt)
            f.seek(0)
            json.dump(data, f, indent=2, ensure_ascii=False)
    with open("activity.log", "a") as log:
        log.write(prompt + "\n")

        with open("notifications.log", "a") as log:
            log.write("Donnée Ajoutée: " + prompt + "\n")

            f.truncate()

        result = "✅ Donnée reçue et ajoutée au système REUSSITESS AI. Merci pour ta contribution."

    elif "donnée ajoutée" in prompt.lower():
        result = cache["afrocaraibeen_knowledge"]["data_add"]
        cache.setdefault("user_contributions", []).append(prompt)

    elif "feedback" in prompt.lower() or "retour" in prompt.lower():
        result = cache["afrocaraibeen_knowledge"]["feedback"]
        cache.setdefault("user_feedback", []).append(prompt)

    elif "mise à jour" in prompt.lower():
        result = cache["afrocaraibeen_knowledge"]["update_info"]
        cache.setdefault("user_updates", []).append(prompt)

    elif "ressource" in prompt.lower() or "lien" in prompt.lower():
        result = cache["afrocaraibeen_knowledge"]["resources"]
        cache.setdefault("user_resources", []).append(prompt)

    elif "question" in prompt.lower():
        result = cache["afrocaraibeen_knowledge"]["questions"]
        cache.setdefault("user_questions", []).append(prompt)

    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)
    with open("activity.log", "a") as log:
        log.write(prompt + "\n")


    return result
