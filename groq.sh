#!/bin/bash

CACHE_FILE="groq_cache.json"
MAX_RETRIES=3
RETRY_DELAY=1

GROQ_KEYS=(
    "${GROQ_KEY_1}"
    "${GROQ_KEY_2}"
    "${GROQ_KEY_3}"
)

for key in "${GROQ_KEYS[@]}"; do
    if [[ -z "$key" ]]; then
        echo "❌ Clé manquante"
        exit 1
    fi
done

declare -A key_success key_fail key_avg
for key in "${GROQ_KEYS[@]}"; do
    key_success["$key"]=0
    key_fail["$key"]=0
    key_avg["$key"]=0
done

_call_groq() {
    echo "Réponse réelle pour '$1'"
}

query_groq() {
    local prompt="$1"
    for k in "${GROQ_KEYS[@]}"; do
        response=$(_call_groq "$prompt" "$k")
        if [[ -n "$response" ]]; then
            echo "$response"
            return
        fi
    done
    echo "⚠️ erreur"
}

query_groq "Test Guadeloupe"
