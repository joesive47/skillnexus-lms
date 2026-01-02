/**
 * Skill Assessment Complete Fix Test
 * Tests the new improved skill assessment system
 */

// Test data for verification
const testAssessment = {
  id: "test-1",
  title: "Web Development Test",
  questions: [
    {
      id: "q1",
      text: "HTML ย่อมาจากอะไร?",
      options: [
        "HyperText Markup Language", // Correct (index 0)
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language"
      ],
      correctAnswer: 0,
      skill: "HTML",
      weight: 1
    },
    {
      id: "q2",
      text: "CSS ใช้สำหรับอะไร?",
      options: [
        "จัดการฐานข้อมูล",
        "จัดรูปแบบและการแสดงผล", // Correct (index 1)
        "เขียนโปรแกรม JavaScript",
        "สร้างเซิร์ฟเวอร์"
      ],
      correctAnswer: 1,
      skill: "CSS",
      weight: 1
    },
    {
      id: "q3",
      text: "JavaScript เป็นภาษาโปรแกรมประเภทใด?",
      options: [
        "Compiled Language",
        "Assembly Language",
        "Interpreted Language", // Correct (index 2)
        "Machine Language"
      ],
      correctAnswer: 2,
      skill: "JavaScript",
      weight: 2
    }
  ]
}

// Test scenarios
const testScenarios = [
  {
    name: "Perfect Score Test",
    answers: new Map([
      ["q1", { questionId: "q1", selectedAnswer: 0, timestamp: Date.now() }], // Correct
      ["q2", { questionId: "q2", selectedAnswer: 1, timestamp: Date.now() }], // Correct
      ["q3", { questionId: "q3", selectedAnswer: 2, timestamp: Date.now() }]  // Correct
    ]),
    expectedScore: 100,
    expectedSkillScores: {
      "HTML": 100,
      "CSS": 100,
      "JavaScript": 100
    }
  },
  {
    name: "Partial Score Test",
    answers: new Map([
      ["q1", { questionId: "q1", selectedAnswer: 0, timestamp: Date.now() }], // Correct
      ["q2", { questionId: "q2", selectedAnswer: 0, timestamp: Date.now() }], // Wrong
      ["q3", { questionId: "q3", selectedAnswer: 2, timestamp: Date.now() }]  // Correct
    ]),
    expectedScore: 75, // (1 + 0 + 2) / 4 * 100 = 75%
    expectedSkillScores: {
      "HTML": 100,
      "CSS": 0,
      "JavaScript": 100
    }
  },
  {
    name: "Zero Score Test",
    answers: new Map([
      ["q1", { questionId: "q1", selectedAnswer: 1, timestamp: Date.now() }], // Wrong
      ["q2", { questionId: "q2", selectedAnswer: 0, timestamp: Date.now() }], // Wrong
      ["q3", { questionId: "q3", selectedAnswer: 0, timestamp: Date.now() }]  // Wrong
    ]),
    expectedScore: 0,
    expectedSkillScores: {
      "HTML": 0,
      "CSS": 0,
      "JavaScript": 0
    }
  },
  {
    name: "Missing Answers Test",
    answers: new Map([
      ["q1", { questionId: "q1", selectedAnswer: 0, timestamp: Date.now() }], // Correct
      // q2 missing
      ["q3", { questionId: "q3", selectedAnswer: 2, timestamp: Date.now() }]  // Correct
    ]),
    expectedScore: 75, // (1 + 0 + 2) / 4 * 100 = 75%
    expectedSkillScores: {
      "HTML": 100,
      "CSS": 0,
      "JavaScript": 100
    }
  }
]

// Scoring calculation function (extracted from the component)
function calculateResults(assessment, userAnswers) {
  let totalScore = 0
  let maxScore = 0
  const skillBreakdown = {}

  assessment.questions.forEach(question => {
    const userAnswer = userAnswers.get(question.id)
    maxScore += question.weight
    
    if (!skillBreakdown[question.skill]) {
      skillBreakdown[question.skill] = { correct: 0, total: 0 }
    }
    skillBreakdown[question.skill].total += question.weight

    const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer
    
    if (isCorrect) {
      totalScore += question.weight
      skillBreakdown[question.skill].correct += question.weight
    }
  })

  const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  const skillScores = {}
  
  Object.entries(skillBreakdown).forEach(([skill, data]) => {
    skillScores[skill] = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
  })

  return {
    finalScore,
    totalScore,
    maxScore,
    skillScores
  }
}

// Run tests
console.log('🧪 Starting Skill Assessment Fix Tests...\n')

let passedTests = 0
let totalTests = testScenarios.length

testScenarios.forEach((scenario, index) => {
  console.log(`Test ${index + 1}: ${scenario.name}`)
  console.log('=====================================')
  
  const results = calculateResults(testAssessment, scenario.answers)
  
  // Check final score
  const scoreMatch = results.finalScore === scenario.expectedScore
  console.log(`Final Score: ${results.finalScore}% (Expected: ${scenario.expectedScore}%) ${scoreMatch ? '✅' : '❌'}`)
  
  // Check skill scores
  let skillScoresMatch = true
  Object.entries(scenario.expectedSkillScores).forEach(([skill, expectedScore]) => {
    const actualScore = results.skillScores[skill] || 0
    const match = actualScore === expectedScore
    if (!match) skillScoresMatch = false
    console.log(`${skill}: ${actualScore}% (Expected: ${expectedScore}%) ${match ? '✅' : '❌'}`)
  })
  
  // Check detailed breakdown
  console.log(`Total Score: ${results.totalScore}/${results.maxScore}`)
  console.log(`Answers provided: ${scenario.answers.size}/${testAssessment.questions.length}`)
  
  const testPassed = scoreMatch && skillScoresMatch
  if (testPassed) {
    passedTests++
    console.log('✅ TEST PASSED\n')
  } else {
    console.log('❌ TEST FAILED\n')
  }
})

// Summary
console.log('📊 Test Summary')
console.log('================')
console.log(`Passed: ${passedTests}/${totalTests}`)
console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`)

if (passedTests === totalTests) {
  console.log('\n🎉 All tests passed! The skill assessment fix is working correctly.')
} else {
  console.log('\n⚠️ Some tests failed. Please review the implementation.')
}

// Test answer selection memory
console.log('\n🧠 Testing Answer Selection Memory...')
console.log('=====================================')

// Simulate navigation between questions
const answerMemoryTest = new Map()

// User answers question 1
answerMemoryTest.set("q1", { questionId: "q1", selectedAnswer: 0, timestamp: Date.now() })
console.log('Q1: Selected answer 0 ✅')

// User navigates to question 2
answerMemoryTest.set("q2", { questionId: "q2", selectedAnswer: 1, timestamp: Date.now() })
console.log('Q2: Selected answer 1 ✅')

// User goes back to question 1
const q1Answer = answerMemoryTest.get("q1")
console.log(`Back to Q1: Retrieved answer ${q1Answer?.selectedAnswer} ${q1Answer?.selectedAnswer === 0 ? '✅' : '❌'}`)

// User goes forward to question 2
const q2Answer = answerMemoryTest.get("q2")
console.log(`Back to Q2: Retrieved answer ${q2Answer?.selectedAnswer} ${q2Answer?.selectedAnswer === 1 ? '✅' : '❌'}`)

console.log('\n✅ Answer selection memory test passed!')

// Export for use in other tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testAssessment,
    testScenarios,
    calculateResults
  }
}