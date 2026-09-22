import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join } from 'path'
import * as XLSX from 'xlsx'

dotenv.config({ path: '.env.production' })

const prisma = new PrismaClient()
const applyChanges = process.argv.includes('--apply')
const confirmation = process.env.QUIZ_ENCODING_REPAIR_CONFIRMATION
const quizTitle = 'Final Assessment: AI Coding Assistance'
const sourceCsvPath = join(process.cwd(), 'deliverables', 'ai-coding-assistance-final-assessment.csv')

type Repair =
  | { kind: 'question'; id: string; text: string }
  | { kind: 'option'; id: string; text: string }

type SourceQuestion = {
  text: string
  options: string[]
  correctIndex: number
}

async function readVerifiedSource(): Promise<SourceQuestion[]> {
  const buffer = await readFile(sourceCsvPath)
  const workbook = XLSX.read(new TextDecoder('utf-8').decode(buffer), { type: 'string' })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)
  const requiredColumns = ['QuestionText', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectOption']

  if (rows.length !== 20 || !rows.every((row) => requiredColumns.every((column) => column in row))) {
    throw new Error('The verified source must contain exactly 20 complete question rows')
  }

  return rows.map((row, index) => {
    const correctOption = String(row.CorrectOption || '').trim().toUpperCase()
    const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctOption)
    const text = String(row.QuestionText || '').trim()
    const options = ['OptionA', 'OptionB', 'OptionC', 'OptionD'].map((column) => String(row[column] || '').trim())

    if (correctIndex < 0 || !text || options.some((option) => !option)) {
      throw new Error(`The verified source row ${index + 2} is invalid`)
    }
    return { text, options, correctIndex }
  })
}

async function repairQuiz() {
  const sourceQuestions = await readVerifiedSource()
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
  if (quiz.questions.length !== sourceQuestions.length) throw new Error('Expected exactly 20 questions; no records were changed')

  const repairs: Repair[] = []
  for (const [index, question] of quiz.questions.entries()) {
    const sourceQuestion = sourceQuestions[index]
    const options = [...question.options].sort((left, right) => left.id.localeCompare(right.id))
    if (options.length !== 4 || options.filter((option) => option.isCorrect).length !== 1 || !options[sourceQuestion.correctIndex].isCorrect) {
      throw new Error(`Question ${index + 1} does not have the expected answer structure; no records were changed`)
    }
    if (question.text !== sourceQuestion.text) {
      repairs.push({ kind: 'question', id: question.id, text: sourceQuestion.text })
    }

    for (const [optionIndex, option] of options.entries()) {
      if (option.text !== sourceQuestion.options[optionIndex]) {
        repairs.push({ kind: 'option', id: option.id, text: sourceQuestion.options[optionIndex] })
      }
    }
  }

  const summary = { quizId: quiz.id, questions: quiz.questions.length, valuesToRepair: repairs.length, mode: applyChanges ? 'APPLY' : 'DRY_RUN' }
  console.log(JSON.stringify(summary, null, 2))

  if (repairs.length === 0) {
    console.log('The assessment already matches the verified UTF-8 source.')
    return
  }

  if (!applyChanges) {
    console.log('Dry run complete. Re-run with --apply and QUIZ_ENCODING_REPAIR_CONFIRMATION=repair-ai-coding-assistance-quiz to restore only values that differ from the verified source.')
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
