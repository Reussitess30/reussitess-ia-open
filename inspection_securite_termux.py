#!/usr/bin/env python3
"""
🔍 INSPECTION COMPLÈTE DE SÉCURITÉ TERMUX
Reussitess© 2025

Analyse TOUTES les applications et fichiers pour détecter :
- Failles de sécurité
- Clés privées exposées
- Permissions dangereuses
- Backdoors
- Malware
- Configurations risquées
"""

import os
import re
import subprocess
import json
from datetime import datetime
import hashlib

class InspecteurSecuriteTermux:
    def __init__(self):
        self.vulnerabilities = []
        self.warnings = []
        self.critical_issues = []
        self.files_scanned = 0
        
        print("╔══════════════════════════════════════════════════════════╗")
        print("║   🔍 INSPECTION SÉCURITÉ TERMUX - ANALYSE COMPLÈTE      ║")
        print("╚══════════════════════════════════════════════════════════╝\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 1 : INSPECTION DES PAQUETS INSTALLÉS
    # ═══════════════════════════════════════════════════════════
    
    def inspect_packages(self):
        """Inspecte tous les paquets installés"""
        
        print("\n" + "="*60)
        print("📦 [1/10] INSPECTION DES PAQUETS INSTALLÉS")
        print("="*60 + "\n")
        
        try:
            # Lister tous les paquets
            result = subprocess.run(['pkg', 'list-installed'], 
                                  capture_output=True, text=True)
            packages = result.stdout.strip().split('\n')
            
            print(f"✅ {len(packages)} paquets installés\n")
            
            # Paquets suspects ou dangereux
            suspicious = ['netcat', 'nmap', 'hydra', 'sqlmap', 'metasploit']
            
            for pkg in packages:
                pkg_name = pkg.split('/')[0] if '/' in pkg else pkg
                
                if any(sus in pkg_name.lower() for sus in suspicious):
                    self.warnings.append({
                        'type': 'SUSPICIOUS_PACKAGE',
                        'package': pkg_name,
                        'reason': 'Paquet potentiellement utilisé pour attaques'
                    })
                    print(f"⚠️ Package suspect : {pkg_name}")
            
            # Vérifier paquets obsolètes
            print("\n🔍 Vérification des mises à jour...\n")
            subprocess.run(['pkg', 'update', '-y'], 
                         stdout=subprocess.DEVNULL, 
                         stderr=subprocess.DEVNULL)
            
            print("✅ Paquets à jour\n")
            
        except Exception as e:
            print(f"❌ Erreur inspection paquets : {e}\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 2 : SCAN DES CLÉS PRIVÉES EXPOSÉES
    # ═══════════════════════════════════════════════════════════
    
    def scan_private_keys(self):
        """Recherche les clés privées exposées"""
        
        print("\n" + "="*60)
        print("🔐 [2/10] SCAN DES CLÉS PRIVÉES EXPOSÉES")
        print("="*60 + "\n")
        
        patterns = [
            (r'0x[a-fA-F0-9]{64}', 'Clé privée Ethereum'),
            (r'private_key\s*=\s*["\']([^"\']+)["\']', 'Variable private_key'),
            (r'PRIVATE_KEY\s*=\s*["\']([^"\']+)["\']', 'Variable PRIVATE_KEY'),
            (r'pk\s*=\s*["\']0x[a-fA-F0-9]{64}["\']', 'Variable pk'),
        ]
        
        home = os.path.expanduser('~')
        exposed_keys = []
        
        for root, dirs, files in os.walk(home):
            # Ignorer certains dossiers
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__']]
            
            for file in files:
                if file.endswith(('.py', '.js', '.sh', '.txt', '.env')):
                    filepath = os.path.join(root, file)
                    
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            self.files_scanned += 1
                            
                            for pattern, key_type in patterns:
                                matches = re.findall(pattern, content)
                                
                                if matches:
                                    for match in matches:
                                        # Vérifier si c'est une vraie clé (pas un exemple)
                                        if 'example' not in match.lower() and 'votre' not in match.lower():
                                            exposed_keys.append({
                                                'file': filepath,
                                                'type': key_type,
                                                'preview': match[:20] + '...' if len(str(match)) > 20 else match
                                            })
                                            
                                            self.critical_issues.append({
                                                'type': 'EXPOSED_PRIVATE_KEY',
                                                'file': filepath,
                                                'key_type': key_type
                                            })
                    except:
                        pass
        
        if exposed_keys:
            print(f"🚨 {len(exposed_keys)} CLÉS PRIVÉES EXPOSÉES TROUVÉES !\n")
            
            for key in exposed_keys:
                print(f"   📁 Fichier : {key['file']}")
                print(f"   🔑 Type    : {key['type']}")
                print(f"   👁️ Aperçu  : {key['preview']}\n")
            
            print("⚠️ ACTION URGENTE REQUISE : Supprimez ces clés des fichiers !\n")
        else:
            print("✅ Aucune clé privée exposée détectée\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 3 : SCAN DES PERMISSIONS DANGEREUSES
    # ═══════════════════════════════════════════════════════════
    
    def scan_dangerous_permissions(self):
        """Vérifie les fichiers avec permissions dangereuses"""
        
        print("\n" + "="*60)
        print("🔒 [3/10] SCAN DES PERMISSIONS DANGEREUSES")
        print("="*60 + "\n")
        
        home = os.path.expanduser('~')
        dangerous_files = []
        
        for root, dirs, files in os.walk(home):
            for file in files:
                filepath = os.path.join(root, file)
                
                try:
                    stat = os.stat(filepath)
                    mode = oct(stat.st_mode)[-3:]
                    
                    # Vérifier si fichier est exécutable par tous (777, 775, etc.)
                    if mode in ['777', '776', '775']:
                        dangerous_files.append({
                            'file': filepath,
                            'permissions': mode
                        })
                        
                        self.warnings.append({
                            'type': 'DANGEROUS_PERMISSIONS',
                            'file': filepath,
                            'permissions': mode
                        })
                except:
                    pass
        
        if dangerous_files:
            print(f"⚠️ {len(dangerous_files)} fichiers avec permissions trop larges :\n")
            
            for item in dangerous_files[:10]:  # Afficher les 10 premiers
                print(f"   📁 {item['file']}")
                print(f"   🔓 Permissions : {item['permissions']}\n")
        else:
            print("✅ Permissions correctes\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 4 : DÉTECTION DE BACKDOORS
    # ═══════════════════════════════════════════════════════════
    
    def detect_backdoors(self):
        """Détecte les backdoors potentiels"""
        
        print("\n" + "="*60)
        print("🚪 [4/10] DÉTECTION DE BACKDOORS")
        print("="*60 + "\n")
        
        backdoor_patterns = [
            (r'eval\s*\(', 'eval() - Exécution de code arbitraire'),
            (r'exec\s*\(', 'exec() - Exécution de code arbitraire'),
            (r'os\.system\s*\(', 'os.system() - Commandes système'),
            (r'subprocess\.call\s*\(.*shell\s*=\s*True', 'subprocess avec shell=True'),
            (r'__import__\s*\(["\']os["\']\)', 'Import dynamique de os'),
            (r'socket\.socket', 'Socket - Connexion réseau'),
            (r'requests\.post\s*\(["\']http', 'POST vers serveur externe'),
        ]
        
        home = os.path.expanduser('~')
        suspicious_code = []
        
        for root, dirs, files in os.walk(home):
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules']]
            
            for file in files:
                if file.endswith(('.py', '.js', '.sh')):
                    filepath = os.path.join(root, file)
                    
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            
                            for pattern, desc in backdoor_patterns:
                                if re.search(pattern, content):
                                    suspicious_code.append({
                                        'file': filepath,
                                        'pattern': desc
                                    })
                    except:
                        pass
        
        if suspicious_code:
            print(f"⚠️ {len(suspicious_code)} patterns suspects détectés :\n")
            
            for item in suspicious_code[:15]:
                print(f"   📁 {item['file']}")
                print(f"   ⚠️  {item['pattern']}\n")
            
            print("💡 Vérifiez ces fichiers manuellement\n")
        else:
            print("✅ Aucun backdoor évident détecté\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 5 : VÉRIFICATION DES CONNEXIONS RÉSEAU ACTIVES
    # ═══════════════════════════════════════════════════════════
    
    def check_network_connections(self):
        """Vérifie les connexions réseau actives"""
        
        print("\n" + "="*60)
        print("🌐 [5/10] CONNEXIONS RÉSEAU ACTIVES")
        print("="*60 + "\n")
        
        try:
            result = subprocess.run(['netstat', '-tuln'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')
                print(f"✅ {len(lines)} connexions actives\n")
                
                # Afficher les premières
                for line in lines[:10]:
                    print(f"   {line}")
                print()
            else:
                print("⚠️ netstat non disponible\n")
        except:
            print("⚠️ Impossible de vérifier les connexions\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 6 : SCAN DES SCRIPTS AU DÉMARRAGE
    # ═══════════════════════════════════════════════════════════
    
    def scan_startup_scripts(self):
        """Vérifie les scripts qui s'exécutent au démarrage"""
        
        print("\n" + "="*60)
        print("🚀 [6/10] SCRIPTS AU DÉMARRAGE")
        print("="*60 + "\n")
        
        startup_files = [
            '~/.bashrc',
            '~/.bash_profile',
            '~/.profile',
            '~/.zshrc',
        ]
        
        for filepath in startup_files:
            full_path = os.path.expanduser(filepath)
            
            if os.path.exists(full_path):
                print(f"📁 Vérification de {filepath}...")
                
                try:
                    with open(full_path, 'r') as f:
                        content = f.read()
                        
                        # Chercher commandes suspectes
                        if 'curl' in content or 'wget' in content:
                            print(f"   ⚠️ Téléchargement détecté dans {filepath}")
                            self.warnings.append({
                                'type': 'SUSPICIOUS_STARTUP',
                                'file': filepath,
                                'reason': 'Téléchargement au démarrage'
                            })
                except:
                    pass
        
        print("\n✅ Scan des scripts de démarrage terminé\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 7 : VÉRIFICATION DES FICHIERS .env
    # ═══════════════════════════════════════════════════════════
    
    def check_env_files(self):
        """Vérifie les fichiers .env pour secrets exposés"""
        
        print("\n" + "="*60)
        print("📄 [7/10] FICHIERS .env ET SECRETS")
        print("="*60 + "\n")
        
        home = os.path.expanduser('~')
        env_files = []
        
        for root, dirs, files in os.walk(home):
            for file in files:
                if file == '.env' or file.endswith('.env'):
                    filepath = os.path.join(root, file)
                    env_files.append(filepath)
                    
                    print(f"📁 Trouvé : {filepath}")
                    
                    # Vérifier les permissions
                    stat = os.stat(filepath)
                    mode = oct(stat.st_mode)[-3:]
                    
                    if mode != '600':
                        print(f"   ⚠️ Permissions : {mode} (recommandé: 600)")
                        self.warnings.append({
                            'type': 'ENV_PERMISSIONS',
                            'file': filepath,
                            'permissions': mode
                        })
        
        if env_files:
            print(f"\n✅ {len(env_files)} fichiers .env trouvés\n")
        else:
            print("✅ Aucun fichier .env trouvé\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 8 : SCAN ANTIVIRUS BASIQUE
    # ═══════════════════════════════════════════════════════════
    
    def basic_antivirus_scan(self):
        """Scan antivirus basique"""
        
        print("\n" + "="*60)
        print("🦠 [8/10] SCAN ANTIVIRUS BASIQUE")
        print("="*60 + "\n")
        
        # Signatures de malware connues
        malware_signatures = [
            'coinminer',
            'cryptominer',
            'ransomware',
            'trojan',
            'backdoor',
        ]
        
        home = os.path.expanduser('~')
        suspicious = []
        
        for root, dirs, files in os.walk(home):
            for file in files:
                filepath = os.path.join(root, file)
                
                # Vérifier le nom du fichier
                if any(sig in file.lower() for sig in malware_signatures):
                    suspicious.append(filepath)
                    print(f"⚠️ Fichier suspect : {filepath}")
        
        if suspicious:
            print(f"\n⚠️ {len(suspicious)} fichiers suspects\n")
        else:
            print("✅ Aucun malware évident détecté\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 9 : VÉRIFICATION INTÉGRITÉ GIT
    # ═══════════════════════════════════════════════════════════
    
    def check_git_integrity(self):
        """Vérifie l'intégrité des dépôts Git"""
        
        print("\n" + "="*60)
        print("🔧 [9/10] INTÉGRITÉ DES DÉPÔTS GIT")
        print("="*60 + "\n")
        
        try:
            os.chdir(os.path.expanduser('~/reussitess-global-nexus'))
            
            # Vérifier le statut
            result = subprocess.run(['git', 'status', '--porcelain'], 
                                  capture_output=True, text=True)
            
            if result.stdout.strip():
                print("⚠️ Modifications non commitées détectées\n")
            else:
                print("✅ Dépôt propre\n")
            
            # Vérifier les remotes
            result = subprocess.run(['git', 'remote', '-v'], 
                                  capture_output=True, text=True)
            
            print("📡 Remotes configurés :")
            print(result.stdout)
            
        except:
            print("⚠️ Pas dans un dépôt Git\n")
    
    # ═══════════════════════════════════════════════════════════
    # MODULE 10 : GÉNÉRATION DU RAPPORT
    # ═══════════════════════════════════════════════════════════
    
    def generate_report(self):
        """Génère le rapport final"""
        
        print("\n" + "="*60)
        print("📊 [10/10] GÉNÉRATION DU RAPPORT")
        print("="*60 + "\n")
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'files_scanned': self.files_scanned,
            'critical_issues': len(self.critical_issues),
            'warnings': len(self.warnings),
            'vulnerabilities': len(self.vulnerabilities),
            'details': {
                'critical': self.critical_issues,
                'warnings': self.warnings,
                'vulnerabilities': self.vulnerabilities
            }
        }
        
        # Sauvegarder
        filename = f"security_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ Rapport sauvegardé : {filename}\n")
        
        # Afficher résumé
        print("╔══════════════════════════════════════════════════════════╗")
        print("║                  RÉSUMÉ DE L'INSPECTION                  ║")
        print("╚══════════════════════════════════════════════════════════╝\n")
        print(f"📁 Fichiers scannés    : {self.files_scanned}")
        print(f"🔥 Problèmes critiques : {len(self.critical_issues)}")
        print(f"⚠️  Avertissements     : {len(self.warnings)}")
        print(f"ℹ️  Vulnérabilités     : {len(self.vulnerabilities)}\n")
        
        if self.critical_issues:
            print("🚨 ACTIONS URGENTES REQUISES :")
            for issue in self.critical_issues:
                print(f"   • {issue['type']}: {issue.get('file', 'N/A')}")
            print()
        
        if len(self.critical_issues) == 0 and len(self.warnings) == 0:
            print("✅ AUCUN PROBLÈME CRITIQUE DÉTECTÉ !")
            print("🛡️ Votre système Termux est sécurisé\n")
        else:
            print("⚠️ Consultez le rapport pour plus de détails\n")
        
        return filename
    
    # ═══════════════════════════════════════════════════════════
    # LANCEMENT COMPLET
    # ═══════════════════════════════════════════════════════════
    
    def run_full_inspection(self):
        """Lance l'inspection complète"""
        
        print("🚀 DÉMARRAGE DE L'INSPECTION COMPLÈTE...\n")
        
        self.inspect_packages()
        self.scan_private_keys()
        self.scan_dangerous_permissions()
        self.detect_backdoors()
        self.check_network_connections()
        self.scan_startup_scripts()
        self.check_env_files()
        self.basic_antivirus_scan()
        self.check_git_integrity()
        report_file = self.generate_report()
        
        print("\n✅ INSPECTION TERMINÉE !")
        print(f"📄 Rapport : {report_file}\n")

if __name__ == "__main__":
    inspector = InspecteurSecuriteTermux()
    inspector.run_full_inspection()
