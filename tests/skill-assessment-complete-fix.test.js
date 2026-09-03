const assessment = {
  questions: [
    { id: 'q1', correctAnswer: 0, skill: 'HTML', weight: 1 },
    { id: 'q2', correctAnswer: 1, skill: 'CSS', weight: 1 },
    { id: 'q3', correctAnswer: 2, skill: 'JavaScript', weight: 2 },
  ],
}

function calculateResults(questions, answers) {
  let totalScore = 0
  let maxScore = 0
  const breakdown = {}
  for (const question of questions) {
    maxScore += question.weight
    breakdown[question.skill] ||= { correct: 0, total: 0 }
    breakdown[question.skill].total += question.weight
    if (answers.get(question.id)?.selectedAnswer === question.correctAnswer) {
      totalScore += question.weight
      breakdown[question.skill].correct += question.weight
    }
  }
  return {
    finalScore: maxScore ? Math.round((totalScore / maxScore) * 100) : 0,
    skillScores: Object.fromEntries(Object.entries(breakdown).map(([skill, score]) => [
      skill, Math.round((score.correct / score.total) * 100),
    ])),
  }
}

describe('Skill assessment weighted scoring', () => {
  test.each([
    ['perfect', [[0], [1], [2]], 100, { HTML: 100, CSS: 100, JavaScript: 100 }],
    ['partial', [[0], [0], [2]], 75, { HTML: 100, CSS: 0, JavaScript: 100 }],
    ['zero', [[1], [0], [0]], 0, { HTML: 0, CSS: 0, JavaScript: 0 }],
    ['missing answer', [[0], [], [2]], 75, { HTML: 100, CSS: 0, JavaScript: 100 }],
  ])('%s result', (_name, selections, expectedScore, expectedSkills) => {
    const answers = new Map()
    selections.forEach((selection, index) => {
      if (selection.length) answers.set(`q${index + 1}`, { selectedAnswer: selection[0] })
    })
    const result = calculateResults(assessment.questions, answers)
    expect(result.finalScore).toBe(expectedScore)
    expect(result.skillScores).toEqual(expectedSkills)
  })

  test('keeps answers available after navigation', () => {
    const answers = new Map([['q1', { selectedAnswer: 0 }], ['q2', { selectedAnswer: 1 }]])
    expect(answers.get('q1').selectedAnswer).toBe(0)
    expect(answers.get('q2').selectedAnswer).toBe(1)
  })
})
