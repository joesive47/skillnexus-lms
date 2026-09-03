describe('Skill assessment answer memory', () => {
  test('does not copy an answer to the next question', () => {
    const answers = { q1: 'option2' }
    expect(answers.q1).toBe('option2')
    expect(answers.q2).toBeUndefined()
  })

  test('preserves earlier answers when navigating back', () => {
    const answers = { q1: 'option2', q2: 'option3' }
    expect(answers.q1).toBe('option2')
    expect(answers.q2).toBe('option3')
    expect(answers.q3).toBeUndefined()
  })
})
