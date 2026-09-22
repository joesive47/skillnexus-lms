import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: '.env.production' })

const prisma = new PrismaClient()
const applyChanges = process.argv.includes('--apply')
const confirmation = process.env.QUIZ_ENCODING_REPAIR_CONFIRMATION
const quizTitle = 'Final Assessment: AI Coding Assistance'
const mojibakeMarker = /à¸|à¹/

type Repair =
  | { kind: 'question'; id: string; text: string }
  | { kind: 'option'; id: string; text: string }

function isMojibake(value: string) {
  return mojibakeMarker.test(value)
}

function restoreUtf8(value: string) {
  const restored = Buffer.from(value, 'latin1').toString('utf8')
  if (!/[\u0E00-\u0E7F]/.test(restored)) {
    throw new Error('A candidate value did not decode to Thai text')
  }
  return restored
}

async function repairQuiz() {
  const quizzes = await prisma.quiz.findMany({
    where: { title: quizTitle },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { options: { orderBy: { id: 'asc' } } },
      },
    },
  })

  if (quizzes.length !== 1) throw new Error('Expected exactly one AI Coding Assistance assessment')
  const quiz = quizzes[0]
  if (quiz.questions.length !== 20) throw new Error('Expected exactly 20 questions; no records were changed')

  const repairs: Repair[] = []
  for (const question of quiz.questions) {
    if (!isMojibake(question.text)) {
      throw new Error(`Question ${question.order + 1} is not the expected UTF-8 mojibake; no records were changed`)
    }
    repairs.push({ kind: 'question', id: question.id, text: restoreUtf8(question.text) })

    for (const option of question.options) {
      if (isMojibake(option.text)) {
        repairs.push({ kind: 'option', id: option.id, text: restoreUtf8(option.text) })
      }
    }
  }

  const summary = { quizId: quiz.id, questions: quiz.questions.length, valuesToRepair: repairs.length, mode: applyChanges ? 'APPLY' : 'DRY_RUN' }
  console.log(JSON.stringify(summary, null, 2))

  if (!applyChanges) {
    console.log('Dry run complete. Re-run with --apply and QUIZ_ENCODING_REPAIR_CONFIRMATION=repair-ai-coding-assistance-quiz to update only the verified mojibake values.')
    return
  }
  if (confirmation !== 'repair-ai-coding-assistance-quiz') {
    throw new Error('A matching QUIZ_ENCODING_REPAIR_CONFIRMATION is required. No records were changed.')
  }

  await prisma.$transaction(async (tx) => {
    for (const repair of repairs) {
      if (repair.kind === 'question') {
        await tx.question.update({ where: { id: repair.id }, data: { text: repair.text } })
      } else {
        await tx.answerOption.update({ where: { id: repair.id }, data: { text: repair.text } })
      }
    }
  }, { maxWait: 10_000, timeout: 30_000 })

  console.log(JSON.stringify({ repaired: true, values: repairs.length }, null, 2))
}

repairQuiz()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
