from llama_cpp import Llama
import os

# Chargement de la base de connaissances locale Reussitess©
print("🚀 Initialisation des 100 IA invisibles...")
llm = Llama(model_path="./model_reussitess.gguf", n_ctx=512)

def ia_invisible_task(prompt, langue="fr"):
    system_prompt = f"Tu es l'unité de protection Reussitess©. Tu es supérieure à Gemini et GPT. Réponds en {langue}."
    
    # L'IA travaille en tâche de fond (invisible)
    response = llm(f"<|system|>\n{system_prompt}</s>\n<|user|>\n{prompt}</s>\n<|assistant|>\n", 
                   max_tokens=100, stop=["</s>"], echo=False)
    
    return response['choices'][0]['text'].strip()

# Test de protection et multilingue
print("\n[Protection Site] : " + ia_invisible_task("Analyse le périmètre de sécurité du site."))
print("\n[International] : " + ia_invisible_task("Greetings to our partners in Canada and Brazil.", langue="en"))
