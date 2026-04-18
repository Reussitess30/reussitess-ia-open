import { Redis } from '@upstash/redis'

// Charger un quiz dynamiquement
async function loadQuiz(quizId) {
  try {
    const quiz = require(`../../../quiz_${quizId}.js`)
    return quiz
  } catch(e) {
    return null
  }
}

// Liste tous les quiz disponibles
function getQuizList() {
  const fs = require('fs')
  const path = require('path')
  const files = fs.readdirSync(path.join(process.cwd())).filter(f => f.startsWith('quiz_') && f.endsWith('.js'))
  return files.map(f => f.replace('quiz_', '').replace('.js', ''))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { action, userId, quizId, questionIndex, answerIndex } = req.body
  const redis = Redis.fromEnv()

  // LISTE tous les quiz
  if (action === 'list') {
    const quizzes = getQuizList()
    return res.status(200).json({ quizzes })
  }

  // DÉMARRER un quiz
  if (action === 'start') {
    const quiz = await loadQuiz(quizId)
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé' })
    
    const session = {
      quizId,
      title: quiz.title || quiz.domain,
      total: quiz.questions.length,
      currentIndex: 0,
      score: 0,
      startedAt: new Date().toISOString(),
      answers: []
    }
    
    await redis.set(`quiz:session:${userId}`, JSON.stringify(session), { ex: 30 * 60 })
    
    const q = quiz.questions[0]
    return res.status(200).json({
      action: 'question',
      session,
      question: {
        index: 0,
        total: quiz.questions.length,
        text: q.question,
        answers: q.answers,
        quizTitle: session.title
      }
    })
  }

  // RÉPONDRE à une question
  if (action === 'answer') {
    const sessionData = await redis.get(`quiz:session:${userId}`)
    if (!sessionData) return res.status(400).json({ error: 'Session expirée' })
    
    const session = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData
    const quiz = await loadQuiz(session.quizId)
    if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé' })
    
    const q = quiz.questions[session.currentIndex]
    const correct = answerIndex === q.correct
    if (correct) session.score++
    
    session.answers.push({ index: session.currentIndex, answer: answerIndex, correct })
    session.currentIndex++
    
    // Fin du quiz
    if (session.currentIndex >= quiz.questions.length) {
      const percentage = Math.round((session.score / quiz.questions.length) * 100)
      const points = session.score * 5
      
      // Sauvegarder score dans Redis
      const profileKey = `quiz:score:${userId}`
      const existing = await redis.get(profileKey)
      const profile = existing ? (typeof existing === 'string' ? JSON.parse(existing) : existing) : { totalPoints: 0, quizzes: [] }
      
      profile.totalPoints = (profile.totalPoints || 0) + points
      profile.quizzes.unshift({
        quizId: session.quizId,
        title: session.title,
        score: session.score,
        total: quiz.questions.length,
        percentage,
        points,
        date: new Date().toISOString()
      })
      profile.quizzes = profile.quizzes.slice(0, 20)
      
      await redis.set(profileKey, JSON.stringify(profile), { ex: 90 * 24 * 60 * 60 })
      await redis.del(`quiz:session:${userId}`)
      
      // Mettre à jour leaderboard
      await redis.zadd('quiz:leaderboard', { score: profile.totalPoints, member: userId })
      
      return res.status(200).json({
        action: 'finished',
        result: {
          score: session.score,
          total: quiz.questions.length,
          percentage,
          points,
          totalPoints: profile.totalPoints,
          explanation: q.explanation
        },
        lastQuestion: {
          correct,
          correctAnswer: q.answers[q.correct],
          explanation: q.explanation
        }
      })
    }
    
    // Question suivante
    await redis.set(`quiz:session:${userId}`, JSON.stringify(session), { ex: 30 * 60 })
    const nextQ = quiz.questions[session.currentIndex]
    
    return res.status(200).json({
      action: 'question',
      feedback: {
        correct,
        correctAnswer: q.answers[q.correct],
        explanation: q.explanation
      },
      question: {
        index: session.currentIndex,
        total: quiz.questions.length,
        text: nextQ.question,
        answers: nextQ.answers,
        score: session.score
      }
    })
  }

  // SCORE utilisateur
  if (action === 'score') {
    const profile = await redis.get(`quiz:score:${userId}`)
    const data = profile ? (typeof profile === 'string' ? JSON.parse(profile) : profile) : { totalPoints: 0, quizzes: [] }
    return res.status(200).json(data)
  }

  // LEADERBOARD
  if (action === 'leaderboard') {
    const top = await redis.zrange('quiz:leaderboard', 0, 9, { rev: true, withScores: true })
    return res.status(200).json({ leaderboard: top })
  }

  return res.status(400).json({ error: 'Action inconnue' })
}
