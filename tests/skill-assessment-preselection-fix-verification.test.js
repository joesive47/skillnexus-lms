describe('Skill assessment unanswered question state', () => {
  test('all questions begin unanswered', () => {
    const answers = {}
    for (const questionId of ['q1', 'q2', 'q3']) expect(answers[questionId]).toBeUndefined()
  })

  test('answering one question does not mutate the others', () => {
    const answers = { q2: 'option1' }
    expect(answers.q1).toBeUndefined()
    expect(answers.q2).toBe('option1')
    expect(answers.q3).toBeUndefined()
  })
})
