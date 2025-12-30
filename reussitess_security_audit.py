#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔒 REUSSITESS© SECURITY AUDIT SYSTEM
Audit de sécurité complet pour infrastructure 200 IA
"""

import os
import subprocess
import json
import datetime
import re
from pathlib import Path

class ReussitessSecurityAudit:
    def __init__(self):
        self.results = {
            "timestamp": datetime.datetime.now().isoformat(),
            "tests": [],
            "vulnerabilities": [],
            "critical_count": 0,
            "high_count": 0,
            "medium_count": 0,
            "low_count": 0
        }
        
    def log(self, message, level="INFO"):
        """Logger avec emojis"""
        icons = {
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "WARNING": "⚠️",
            "CRITICAL": "🚨",
            "ERROR": "❌"
        }
        print(f"{icons.get(level, 'ℹ️')} [{level}] {message}")
        
    def add_vulnerability(self, title, severity, description, file=None):
        """Ajoute une vulnérabilité détectée"""
        vuln = {
            "title": title,
            "severity": severity,
            "description": description,
            "file": file,
            "timestamp": datetime.datetime.now().isoformat()
        }
        self.results["vulnerabilities"].append(vuln)
        
        if severity == "CRITICAL":
            self.results["critical_count"] += 1
        elif severity == "HIGH":
            self.results["high_count"] += 1
        elif severity == "MEDIUM":
            self.results["medium_count"] += 1
        else:
            self.results["low_count"] += 1
            
    def test_exposed_processes(self):
        """Test 1: Processus et ports exposés"""
        self.log("Test 1/10: Analyse des processus exposés", "INFO")
        
        try:
            result = subprocess.run(['netstat', '-tuln'], 
                                  capture_output=True, text=True, timeout=10)
            
            open_ports = []
            for line in result.stdout.split('\n'):
                if 'LISTEN' in line:
                    parts = line.split()
                    if len(parts) >= 4:
                        port = parts[3].split(':')[-1]
                        open_ports.append(port)
            
            self.results["tests"].append({
                "name": "Ports exposés",
                "ports": open_ports,
                "count": len(open_ports)
            })
            
            if '3000' in open_ports:
                self.add_vulnerability(
                    "Port 3000 exposé publiquement",
                    "HIGH",
                    "Le serveur Python HTTP sur le port 3000 est accessible. Risque d'accès non autorisé."
                )
            
            self.log(f"Ports détectés: {len(open_ports)}", "SUCCESS")
            
        except Exception as e:
            self.log(f"Erreur test processus: {e}", "ERROR")
    
    def test_secrets_exposure(self):
        """Test 2: Exposition de secrets"""
        self.log("Test 2/10: Scan des secrets exposés", "INFO")
        
        patterns = [
            (r'API[-_]?KEY\s*=\s*["\']([^"\']+)["\']', "API Key"),
            (r'SECRET[-_]?KEY\s*=\s*["\']([^"\']+)["\']', "Secret Key"),
            (r'PASSWORD\s*=\s*["\']([^"\']+)["\']', "Password"),
            (r'TOKEN\s*=\s*["\']([^"\']+)["\']', "Token"),
            (r'sk-[a-zA-Z0-9]{20,}', "OpenAI Key"),
            (r'ghp_[a-zA-Z0-9]{36}', "GitHub Token"),
        ]
        
        exposed_secrets = []
        extensions = ['*.py', '*.js', '*.env', '*.json', '*.yml', '*.yaml']
        
        for ext in extensions:
            for filepath in Path('.').rglob(ext):
                if 'node_modules' in str(filepath) or '.git' in str(filepath):
                    continue
                    
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        
                    for pattern, secret_type in patterns:
                        matches = re.findall(pattern, content, re.IGNORECASE)
                        if matches:
                            exposed_secrets.append({
                                "file": str(filepath),
                                "type": secret_type,
                                "count": len(matches)
                            })
                            
                            self.add_vulnerability(
                                f"{secret_type} exposé dans le code",
                                "CRITICAL",
                                f"Secret détecté en clair dans {filepath}",
                                str(filepath)
                            )
                except:
                    pass
        
        self.results["tests"].append({
            "name": "Secrets exposés",
            "files": exposed_secrets,
            "count": len(exposed_secrets)
        })
        
        self.log(f"Secrets trouvés: {len(exposed_secrets)}", 
                "CRITICAL" if exposed_secrets else "SUCCESS")
    
    def test_file_permissions(self):
        """Test 3: Permissions fichiers"""
        self.log("Test 3/10: Audit des permissions", "INFO")
        
        dangerous_perms = []
        
        for filepath in Path('.').rglob('*.py'):
            if 'node_modules' in str(filepath):
                continue
            try:
                stat = filepath.stat()
                mode = oct(stat.st_mode)[-3:]
                
                if mode[2] in ['2', '3', '6', '7']:
                    dangerous_perms.append(str(filepath))
                    self.add_vulnerability(
                        "Permissions fichier dangereuses",
                        "MEDIUM",
                        f"Fichier {filepath} modifiable par n'importe qui (mode: {mode})",
                        str(filepath)
                    )
            except:
                pass
        
        for filepath in Path('.').rglob('.env*'):
            try:
                stat = filepath.stat()
                mode = oct(stat.st_mode)[-3:]
                
                if mode != '600':
                    self.add_vulnerability(
                        "Fichier .env mal protégé",
                        "HIGH",
                        f"{filepath} devrait être en mode 600, actuellement {mode}",
                        str(filepath)
                    )
            except:
                pass
        
        self.results["tests"].append({
            "name": "Permissions dangereuses",
            "files": dangerous_perms,
            "count": len(dangerous_perms)
        })
        
        self.log(f"Fichiers à corriger: {len(dangerous_perms)}", 
                "WARNING" if dangerous_perms else "SUCCESS")
    
    def test_code_injection(self):
        """Test 4: Détection injections de code"""
        self.log("Test 4/10: Recherche vulnérabilités injection", "INFO")
        
        dangerous_functions = [
            ('exec(', 'Python exec'),
            ('eval(', 'Eval'),
            ('subprocess.call(', 'Subprocess call'),
            ('os.system(', 'OS system'),
            ('shell=True', 'Shell injection'),
            ('dangerouslySetInnerHTML', 'XSS React'),
            ('innerHTML =', 'DOM XSS'),
        ]
        
        injection_risks = []
        
        for ext in ['*.py', '*.js', '*.jsx']:
            for filepath in Path('.').rglob(ext):
                if 'node_modules' in str(filepath):
                    continue
                    
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        
                    for func, risk_type in dangerous_functions:
                        if func in content:
                            count = content.count(func)
                            injection_risks.append({
                                "file": str(filepath),
                                "function": func,
                                "type": risk_type,
                                "occurrences": count
                            })
                            
                            severity = "HIGH" if func in ['exec(', 'eval(', 'os.system('] else "MEDIUM"
                            self.add_vulnerability(
                                f"Fonction dangereuse: {func}",
                                severity,
                                f"{count}x {risk_type} trouvé dans {filepath}",
                                str(filepath)
                            )
                except:
                    pass
        
        self.results["tests"].append({
            "name": "Risques d'injection",
            "findings": injection_risks,
            "count": len(injection_risks)
        })
        
        self.log(f"Fonctions dangereuses: {len(injection_risks)}", 
                "WARNING" if injection_risks else "SUCCESS")
    
    def test_npm_vulnerabilities(self):
        """Test 5: Vulnérabilités npm"""
        self.log("Test 5/10: Audit npm", "INFO")
        
        try:
            result = subprocess.run(['npm', 'audit', '--json'], 
                                  capture_output=True, text=True, timeout=30)
            
            if result.stdout:
                audit_data = json.loads(result.stdout)
                vulns = audit_data.get('metadata', {}).get('vulnerabilities', {})
                
                self.results["tests"].append({
                    "name": "NPM Audit",
                    "critical": vulns.get('critical', 0),
                    "high": vulns.get('high', 0),
                    "moderate": vulns.get('moderate', 0),
                    "low": vulns.get('low', 0)
                })
                
                total = sum(vulns.values())
                
                if vulns.get('critical', 0) > 0:
                    self.add_vulnerability(
                        "Dépendances npm critiques",
                        "CRITICAL",
                        f"{vulns.get('critical')} vulnérabilités critiques dans node_modules"
                    )
                
                self.log(f"Vulnérabilités npm: {total}", 
                        "CRITICAL" if total > 50 else "WARNING" if total > 0 else "SUCCESS")
            else:
                self.log("npm audit non disponible", "WARNING")
                
        except Exception as e:
            self.log(f"npm audit échoué: {e}", "WARNING")
    
    def test_sensitive_logs(self):
        """Test 6: Données sensibles dans logs"""
        self.log("Test 6/10: Scan des logs", "INFO")
        
        sensitive_patterns = ['password', 'token', 'secret', 'api_key', 'apikey']
        risky_logs = []
        
        for filepath in Path('.').rglob('*.log'):
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read().lower()
                    
                found = [p for p in sensitive_patterns if p in content]
                
                if found:
                    risky_logs.append({
                        "file": str(filepath),
                        "patterns": found
                    })
                    
                    self.add_vulnerability(
                        "Données sensibles dans logs",
                        "HIGH",
                        f"Mots-clés sensibles trouvés: {', '.join(found)}",
                        str(filepath)
                    )
            except:
                pass
        
        self.results["tests"].append({
            "name": "Logs sensibles",
            "files": risky_logs,
            "count": len(risky_logs)
        })
        
        self.log(f"Logs à risque: {len(risky_logs)}", 
                "WARNING" if risky_logs else "SUCCESS")
    
    def test_api_endpoints(self):
        """Test 7: Endpoints API exposés"""
        self.log("Test 7/10: Cartographie des endpoints", "INFO")
        
        endpoints = []
        patterns = [
            (r'app\.(get|post|put|delete|patch)\(["\']([^"\']+)', 'Express'),
            (r'@app\.route\(["\']([^"\']+)', 'Flask'),
            (r'router\.(get|post|put|delete)\(["\']([^"\']+)', 'Router'),
        ]
        
        for ext in ['*.py', '*.js']:
            for filepath in Path('.').rglob(ext):
                if 'node_modules' in str(filepath):
                    continue
                    
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    for pattern, framework in patterns:
                        matches = re.findall(pattern, content)
                        for match in matches:
                            endpoint = match[1] if isinstance(match, tuple) and len(match) > 1 else match
                            endpoints.append({
                                "path": endpoint,
                                "file": str(filepath),
                                "framework": framework
                            })
                except:
                    pass
        
        self.results["tests"].append({
            "name": "API Endpoints",
            "endpoints": endpoints[:20],
            "total_count": len(endpoints)
        })
        
        self.log(f"Endpoints trouvés: {len(endpoints)}", "INFO")
    
    def test_ia_protection(self):
        """Test 8: Protection des 200 IA"""
        self.log("Test 8/10: Vérification protection IA", "INFO")
        
        protection_files = [
            'bouclier_fantome.py',
            'ia_contre_tracage.py',
            'ia_diversion_leurre.py',
            'mode_sommeil_reussitess.py'
        ]
        
        active_protections = []
        
        for pfile in protection_files:
            if Path(pfile).exists():
                active_protections.append(pfile)
                
                try:
                    result = subprocess.run(['ps', 'aux'], 
                                          capture_output=True, text=True)
                    if pfile in result.stdout:
                        self.log(f"✅ {pfile} actif", "SUCCESS")
                    else:
                        self.add_vulnerability(
                            f"Protection IA inactive: {pfile}",
                            "MEDIUM",
                            f"Le fichier existe mais le processus ne tourne pas"
                        )
                except:
                    pass
        
        self.results["tests"].append({
            "name": "Protection IA",
            "active": active_protections,
            "count": len(active_protections),
            "expected": len(protection_files)
        })
        
        coverage = (len(active_protections) / len(protection_files)) * 100
        self.log(f"Couverture protection: {coverage:.0f}%", 
                "SUCCESS" if coverage == 100 else "WARNING")
    
    def test_database_security(self):
        """Test 9: Sécurité base de données"""
        self.log("Test 9/10: Audit sécurité BDD", "INFO")
        
        db_issues = []
        db_patterns = [
            r'mysql://([^:]+):([^@]+)@',
            r'postgresql://([^:]+):([^@]+)@',
            r'mongodb://([^:]+):([^@]+)@',
        ]
        
        for ext in ['*.py', '*.js', '*.env']:
            for filepath in Path('.').rglob(ext):
                if 'node_modules' in str(filepath):
                    continue
                    
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    for pattern in db_patterns:
                        if re.search(pattern, content):
                            db_issues.append(str(filepath))
                            self.add_vulnerability(
                                "Credentials DB en clair",
                                "CRITICAL",
                                f"Connexion BDD avec credentials dans {filepath}",
                                str(filepath)
                            )
                except:
                    pass
        
        self.results["tests"].append({
            "name": "Sécurité Database",
            "issues": db_issues,
            "count": len(db_issues)
        })
        
        self.log(f"Problèmes BDD: {len(db_issues)}", 
                "CRITICAL" if db_issues else "SUCCESS")
    
    def test_cors_and_headers(self):
        """Test 10: CORS et headers de sécurité"""
        self.log("Test 10/10: Configuration sécurité web", "INFO")
        
        security_headers = []
        cors_issues = []
        
        for filepath in Path('.').rglob('*.js'):
            if 'node_modules' in str(filepath):
                continue
                
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                if 'Access-Control-Allow-Origin' in content and '*' in content:
                    cors_issues.append(str(filepath))
                    self.add_vulnerability(
                        "CORS trop permissif",
                        "MEDIUM",
                        f"CORS wildcard (*) détecté dans {filepath}",
                        str(filepath)
                    )
                
                if 'helmet' in content or 'Content-Security-Policy' in content:
                    security_headers.append(str(filepath))
                    
            except:
                pass
        
        self.results["tests"].append({
            "name": "Sécurité Web",
            "cors_issues": len(cors_issues),
            "security_headers": len(security_headers)
        })
        
        self.log(f"CORS issues: {len(cors_issues)}", 
                "WARNING" if cors_issues else "SUCCESS")
    
    def generate_report(self):
        """Génère le rapport final"""
        self.log("", "INFO")
        self.log("═" * 60, "INFO")
        self.log("🔒 RAPPORT D'AUDIT DE SÉCURITÉ REUSSITESS©", "INFO")
        self.log("═" * 60, "INFO")
        self.log("", "INFO")
        
        self.log(f"🚨 CRITIQUE: {self.results['critical_count']}", 
                "CRITICAL" if self.results['critical_count'] > 0 else "INFO")
        self.log(f"⚠️  HAUTE:    {self.results['high_count']}", 
                "WARNING" if self.results['high_count'] > 0 else "INFO")
        self.log(f"⚡ MOYENNE:  {self.results['medium_count']}", "INFO")
        self.log(f"ℹ️  BASSE:    {self.results['low_count']}", "INFO")
        self.log("", "INFO")
        
        total_vulns = (self.results['critical_count'] * 10 + 
                      self.results['high_count'] * 5 + 
                      self.results['medium_count'] * 2 + 
                      self.results['low_count'])
        
        security_score = max(0, 100 - total_vulns)
        
        if security_score >= 80:
            level = "SUCCESS"
            emoji = "🟢"
        elif security_score >= 60:
            level = "WARNING"
            emoji = "🟡"
        else:
            level = "CRITICAL"
            emoji = "🔴"
            
        self.log(f"{emoji} SCORE DE SÉCURITÉ: {security_score}/100", level)
        self.log("", "INFO")
        
        critical_vulns = [v for v in self.results['vulnerabilities'] 
                         if v['severity'] == 'CRITICAL']
        
        if critical_vulns:
            self.log("🚨 TOP VULNÉRABILITÉS CRITIQUES:", "CRITICAL")
            for i, vuln in enumerate(critical_vulns[:5], 1):
                self.log(f"  {i}. {vuln['title']}", "CRITICAL")
                self.log(f"     └─ {vuln['description']}", "INFO")
        
        self.log("", "INFO")
        self.log("═" * 60, "INFO")
        
        report_file = f"security_audit_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        self.log(f"📄 Rapport complet: {report_file}", "SUCCESS")
        
        return security_score
    
    def run_full_audit(self):
        """Lance l'audit complet"""
        self.log("", "INFO")
        self.log("🔒 DÉMARRAGE AUDIT DE SÉCURITÉ REUSSITESS©", "INFO")
        self.log("=" * 60, "INFO")
        self.log("", "INFO")
        
        self.test_exposed_processes()
        self.test_secrets_exposure()
        self.test_file_permissions()
        self.test_code_injection()
        self.test_npm_vulnerabilities()
        self.test_sensitive_logs()
        self.test_api_endpoints()
        self.test_ia_protection()
        self.test_database_security()
        self.test_cors_and_headers()
        
        score = self.generate_report()
        
        return score

if __name__ == "__main__":
    auditor = ReussitessSecurityAudit()
    security_score = auditor.run_full_audit()
    
    if security_score < 60:
        exit(1)
    elif security_score < 80:
        exit(2)
    else:
        exit(0)
