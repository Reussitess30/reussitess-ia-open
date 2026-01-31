import os
import re
import json
from datetime import datetime

print("🔍 ANALYSE COMPLÈTE DU DOSSIER eip7702-clean")
print("="*70)
print()

# Statistiques
stats = {
    'total_files': 0,
    'python_scripts': [],
    'javascript_scripts': [],
    'shell_scripts': [],
    'json_files': [],
    'text_files': [],
    'sol_files': [],
    'total_lines': 0,
    'total_size_kb': 0,
    'files_with_secrets': [],
    'files_with_wallets': [],
    'active_scripts': [],
    'deprecated_scripts': []
}

# Patterns dangereux
dangerous_patterns = {
    'private_keys': r'(?:PRIVATE_KEY|pk|privateKey)\s*=\s*["\']0x[a-fA-F0-9]{64}',
    'wallet_addresses': r'0x[a-fA-F0-9]{40}',
    'api_keys': r'(?:API_KEY|apikey|api_key)\s*=\s*["\'][^"\']{20,}',
    'seed_phrases': r'(?:mnemonic|seed)\s*=\s*["\']',
}

def analyze_file(filepath):
    """Analyse détaillée d'un fichier"""
    result = {
        'name': os.path.basename(filepath),
        'path': filepath,
        'size_kb': 0,
        'lines': 0,
        'type': '',
        'created': '',
        'contains_secrets': False,
        'wallet_addresses': set(),
        'api_references': [],
        'imports': [],
        'functions': [],
        'purpose': 'Unknown',
        'is_active': False,
        'danger_level': 0
    }
    
    try:
        # Infos fichier
        stat = os.stat(filepath)
        result['size_kb'] = stat.st_size / 1024
        result['created'] = datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M')
        
        # Extension
        ext = os.path.splitext(filepath)[1]
        result['type'] = ext
        
        # Lire contenu
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
                result['lines'] = len(lines)
                
                # Déterminer le but du script
                first_lines = '\n'.join(lines[:20]).lower()
                
                if 'verification' in first_lines or 'verify' in first_lines:
                    result['purpose'] = 'Verification'
                elif 'audit' in first_lines or 'security' in first_lines:
                    result['purpose'] = 'Security Audit'
                elif 'deploy' in first_lines:
                    result['purpose'] = 'Deployment'
                elif 'analyze' in first_lines or 'check' in first_lines:
                    result['purpose'] = 'Analysis'
                elif 'liquidit' in first_lines:
                    result['purpose'] = 'Liquidity'
                elif 'abi' in first_lines:
                    result['purpose'] = 'ABI Management'
                
                # Détecter secrets
                for pattern_name, pattern in dangerous_patterns.items():
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    if matches:
                        result['contains_secrets'] = True
                        if pattern_name == 'wallet_addresses':
                            result['wallet_addresses'].update(matches[:5])
                        if pattern_name == 'private_keys':
                            result['danger_level'] = max(result['danger_level'], 4)
                        elif pattern_name == 'api_keys':
                            result['danger_level'] = max(result['danger_level'], 2)
                
                # Détecter imports Python
                if ext == '.py':
                    imports = re.findall(r'(?:from|import)\s+([a-zA-Z0-9_.]+)', content)
                    result['imports'] = list(set(imports[:10]))
                    
                    # Détecter fonctions
                    functions = re.findall(r'def\s+([a-zA-Z0-9_]+)\s*\(', content)
                    result['functions'] = functions[:10]
                    
                    # Script actif ?
                    if 'if __name__' in content or lines[0].startswith('#!'):
                        result['is_active'] = True
                
                # Références API
                api_refs = []
                if 'polygonscan' in content.lower():
                    api_refs.append('PolygonScan')
                if 'alchemy' in content.lower():
                    api_refs.append('Alchemy')
                if 'solidityscan' in content.lower():
                    api_refs.append('SolidityScan')
                if 'ankr' in content.lower():
                    api_refs.append('Ankr')
                result['api_references'] = api_refs
                
        except Exception as e:
            result['error'] = str(e)
    
    except Exception as e:
        result['error'] = str(e)
    
    return result

# Lister tous les fichiers
print("📂 Scan du dossier...\n")

all_files = []
for item in os.listdir('.'):
    if os.path.isfile(item):
        all_files.append(item)

print(f"✅ {len(all_files)} fichiers trouvés\n")

# Analyser chaque fichier
results = []
for filename in sorted(all_files):
    result = analyze_file(filename)
    results.append(result)
    
    stats['total_files'] += 1
    stats['total_lines'] += result['lines']
    stats['total_size_kb'] += result['size_kb']
    
    # Catégoriser
    if result['type'] == '.py':
        stats['python_scripts'].append(result)
    elif result['type'] == '.js':
        stats['javascript_scripts'].append(result)
    elif result['type'] == '.sh':
        stats['shell_scripts'].append(result)
    elif result['type'] == '.json':
        stats['json_files'].append(result)
    elif result['type'] == '.sol':
        stats['sol_files'].append(result)
    elif result['type'] in ['.txt', '.md']:
        stats['text_files'].append(result)
    
    if result['contains_secrets']:
        stats['files_with_secrets'].append(result)
    
    if result['wallet_addresses']:
        stats['files_with_wallets'].append(result)
    
    if result['is_active']:
        stats['active_scripts'].append(result)

# RAPPORT
print("="*70)
print("📊 STATISTIQUES GLOBALES")
print("="*70)
print()
print(f"📁 Total fichiers: {stats['total_files']}")
print(f"📏 Total lignes: {stats['total_lines']:,}")
print(f"💾 Taille totale: {stats['total_size_kb']:.1f} KB")
print()
print(f"🐍 Scripts Python: {len(stats['python_scripts'])}")
print(f"📜 Scripts JavaScript: {len(stats['javascript_scripts'])}")
print(f"⚙️ Scripts Shell: {len(stats['shell_scripts'])}")
print(f"📋 Fichiers JSON: {len(stats['json_files'])}")
print(f"📄 Fichiers Solidity: {len(stats['sol_files'])}")
print(f"📝 Fichiers texte: {len(stats['text_files'])}")
print()
print(f"⚡ Scripts actifs: {len(stats['active_scripts'])}")
print(f"🔒 Fichiers avec secrets: {len(stats['files_with_secrets'])}")
print(f"💼 Fichiers avec wallets: {len(stats['files_with_wallets'])}")

# SCRIPTS PYTHON PAR CATÉGORIE
if stats['python_scripts']:
    print("\n" + "="*70)
    print("🐍 SCRIPTS PYTHON PAR CATÉGORIE")
    print("="*70)
    
    by_purpose = {}
    for script in stats['python_scripts']:
        purpose = script['purpose']
        if purpose not in by_purpose:
            by_purpose[purpose] = []
        by_purpose[purpose].append(script)
    
    for purpose, scripts in sorted(by_purpose.items()):
        print(f"\n📌 {purpose} ({len(scripts)} scripts)")
        for script in sorted(scripts, key=lambda x: x['lines'], reverse=True):
            active = "⚡" if script['is_active'] else "⏸️"
            danger = "🚨" if script['danger_level'] >= 3 else "⚠️" if script['danger_level'] >= 2 else "✅"
            print(f"  {active} {danger} {script['name']} ({script['lines']} lignes)")
            if script['api_references']:
                print(f"      APIs: {', '.join(script['api_references'])}")

# TOP 10 PLUS GROS FICHIERS
print("\n" + "="*70)
print("📊 TOP 10 FICHIERS PAR TAILLE")
print("="*70)

top_files = sorted(results, key=lambda x: x['lines'], reverse=True)[:10]
for i, f in enumerate(top_files, 1):
    print(f"\n{i}. {f['name']}")
    print(f"   Lignes: {f['lines']:,}")
    print(f"   Taille: {f['size_kb']:.1f} KB")
    print(f"   Type: {f['purpose']}")
    if f['api_references']:
        print(f"   APIs: {', '.join(f['api_references'])}")

# FICHIERS AVEC SECRETS
if stats['files_with_secrets']:
    print("\n" + "="*70)
    print("🔒 FICHIERS AVEC DONNÉES SENSIBLES")
    print("="*70)
    
    for f in stats['files_with_secrets']:
        danger = "🔴" if f['danger_level'] >= 3 else "🟠"
        print(f"\n{danger} {f['name']}")
        print(f"   Niveau danger: {f['danger_level']}/4")
        if f['wallet_addresses']:
            print(f"   Wallets trouvés: {len(f['wallet_addresses'])}")

# FICHIERS SOLIDITY
if stats['sol_files']:
    print("\n" + "="*70)
    print("📄 FICHIERS SOLIDITY")
    print("="*70)
    
    for f in stats['sol_files']:
        print(f"\n✅ {f['name']}")
        print(f"   Lignes: {f['lines']}")
        print(f"   Taille: {f['size_kb']:.1f} KB")
        print(f"   Date: {f['created']}")

# FICHIERS JSON
if stats['json_files']:
    print("\n" + "="*70)
    print("📋 FICHIERS JSON")
    print("="*70)
    
    for f in stats['json_files']:
        print(f"\n📦 {f['name']} ({f['size_kb']:.1f} KB)")

# RECOMMANDATIONS
print("\n" + "="*70)
print("💡 RECOMMANDATIONS")
print("="*70)

if stats['files_with_secrets']:
    print(f"\n⚠️ {len(stats['files_with_secrets'])} fichiers contiennent des données sensibles")
    print("   → Vérifiez que .env est dans .gitignore")
    print("   → Déplacez les secrets vers .env")

if len(stats['python_scripts']) > 50:
    print(f"\n📊 {len(stats['python_scripts'])} scripts Python détectés")
    print("   → Organisez en sous-dossiers par fonction")
    print("   → Supprimez les scripts obsolètes")

if stats['active_scripts']:
    print(f"\n⚡ {len(stats['active_scripts'])} scripts actifs identifiés")
    print("   → Documentez leur usage")
    print("   → Ajoutez des README")

# Sauvegarder
report_data = {
    'timestamp': datetime.now().isoformat(),
    'total_files': stats['total_files'],
    'total_lines': stats['total_lines'],
    'python_scripts': len(stats['python_scripts']),
    'files_with_secrets': len(stats['files_with_secrets']),
    'danger_level': 'HIGH' if len(stats['files_with_secrets']) > 5 else 'MEDIUM' if len(stats['files_with_secrets']) > 0 else 'LOW'
}

with open('FOLDER_ANALYSIS_REPORT.json', 'w') as f:
    json.dump(report_data, f, indent=2)

print("\n" + "="*70)
print("✅ Rapport sauvegardé: FOLDER_ANALYSIS_REPORT.json")
print("="*70)
