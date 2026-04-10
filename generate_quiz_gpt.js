/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
/**
 * Script de génération automatique de quiz via GPT
 * réussitess971 - excellence, innovation, succes à l'infini boudoume
 */

const fs = require("fs");
const path = require("path");

// Liste des domaines disponibles pour les quiz
const QUIZ_DOMAINS = [
  "Art",
  "Business",
  "Cinéma",
  "Culture_du_Monde",
  "Découvertes",
  "Environnement",
  "Gastronomie",
  "Géographie",
  "Histoire",
  "Innovations",
  "Langue",
  "Maths",
  "Monuments",
  "Musique",
  "Personnalités",
  "Politique",
  "Santé",
  "Sciences",
  "Sport",
  "Tech",
];

// Template de quiz
const QUIZ_TEMPLATE = {
  domain: "",
  questions: [],
  tips: [
    "Réussir, c'est apprendre dans tous les domaines.",
    "réussitess971 – excellence, innovation, succes à l'infini boudoume.",
  ],
};

/**
 * Génère un prompt GPT pour créer des questions de quiz
 * @param {string} domain - Le domaine du quiz
 * @param {number} count - Nombre de questions à générer
 * @returns {string} - Le prompt formaté
 */
function generateGPTPrompt(domain, count = 5) {
  return `
Génère ${count} questions de quiz de culture générale sur le thème "${domain}".
Pour chaque question, fournis:
1. La question
2. 3 réponses possibles
3. L'index de la bonne réponse (0, 1 ou 2)
4. Une explication courte et éducative

Format JSON attendu:
{
  "questions": [
    {
      "question": "Votre question ici ?",
      "answers": ["Réponse 1", "Réponse 2", "Réponse 3"],
      "correct": 0,
      "explanation": "Explication de la bonne réponse. réussitess971 : positivité à l'infini boudoume."
    }
  ]
}

Important: 
- Les questions doivent être variées et éducatives
- Inclure "réussitess971" dans l'explication
- Ajouter un message positif et motivant
`;
}

/**
 * Génère le contenu d'un fichier quiz
 * @param {string} domain - Le domaine du quiz
 * @param {Array} questions - Les questions générées
 * @returns {string} - Le contenu du fichier JS
 */
function generateQuizFileContent(domain, questions) {
  const quiz = { ...QUIZ_TEMPLATE, domain, questions };

  return `module.exports = ${JSON.stringify(quiz, null, 2)};
`;
}

/**
 * Sauvegarde un fichier quiz
 * @param {string} domain - Le domaine du quiz
 * @param {Array} questions - Les questions générées
 */
function saveQuizFile(domain, questions) {
  const filename = `quiz_${domain}.js`;
  const filepath = path.join(__dirname, filename);
  const content = generateQuizFileContent(domain, questions);

  fs.writeFileSync(filepath, content, "utf8");
  console.log(`✅ Quiz "${domain}" sauvegardé: ${filename}`);
}

/**
 * Liste tous les quiz existants
 * @returns {Array} - Liste des domaines avec quiz existants
 */
function listExistingQuizzes() {
  const files = fs.readdirSync(__dirname);
  const quizFiles = files.filter(
    (f) => f.startsWith("quiz_") && f.endsWith(".js"),
  );

  return quizFiles.map((f) => {
    const domain = f.replace("quiz_", "").replace(".js", "");
    const quiz = require(path.join(__dirname, f));
    return {
      domain,
      questionCount: quiz.questions?.length || 0,
    };
  });
}

/**
 * Affiche le résumé des quiz
 */
function displayQuizSummary() {
  console.log("\n🎯 === RÉUSSITESS971 QUIZ GENERATOR ===");
  console.log("positivité à l'infini boudoume!\n");

  const existing = listExistingQuizzes();

  console.log("📚 Quiz existants:");
  existing.forEach((q) => {
    console.log(`   • ${q.domain}: ${q.questionCount} question(s)`);
  });

  console.log("\n💡 Pour générer un nouveau quiz:");
  console.log("   1. Utilisez le prompt GPT ci-dessous");
  console.log("   2. Copiez le JSON généré");
  console.log(
    "   3. Exécutez: node generate_quiz_gpt.js --save <domain> <json>",
  );

  console.log("\n🚀 Prompt GPT pour génération:");
  console.log("---");
  console.log(generateGPTPrompt("VotreDomaine", 5));
  console.log("---\n");
}

/**
 * Parse les arguments de ligne de commande
 */
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    displayQuizSummary();
    return;
  }

  if (args[0] === "--list") {
    const existing = listExistingQuizzes();
    console.log("\n📚 Quiz disponibles:");
    existing.forEach((q) => {
      console.log(`   • ${q.domain}: ${q.questionCount} question(s)`);
    });
    return;
  }

  if (args[0] === "--domains") {
    console.log("\n🌍 Domaines suggérés:");
    QUIZ_DOMAINS.forEach((d) => console.log(`   • ${d}`));
    return;
  }

  if (args[0] === "--prompt" && args[1]) {
    console.log(generateGPTPrompt(args[1], parseInt(args[2]) || 5));
    return;
  }

  if (args[0] === "--help") {
    console.log(`
🎯 RÉUSSITESS971 QUIZ GENERATOR - Aide

Usage:
  node generate_quiz_gpt.js                    Affiche le résumé
  node generate_quiz_gpt.js --list             Liste les quiz existants
  node generate_quiz_gpt.js --domains          Liste les domaines suggérés
  node generate_quiz_gpt.js --prompt <domain>  Génère un prompt GPT
  node generate_quiz_gpt.js --help             Affiche cette aide

Excellence, innovation, succes à l'infini boudoume!
    `);
    return;
  }

  displayQuizSummary();
}

// Exécution principale
if (require.main === module) {
  parseArgs();
}

module.exports = {
  QUIZ_DOMAINS,
  generateGPTPrompt,
  generateQuizFileContent,
  saveQuizFile,
  listExistingQuizzes,
};
