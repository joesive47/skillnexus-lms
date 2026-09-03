import { NextResponse } from 'next/server'

export async function GET() {
  const template = `question_id,career_title,skill_name,question_text,option_1,option_2,option_3,option_4,correct_answer,score,skill_category,skill_importance,question_type,difficulty_level,explanation,course_link,course_title,learning_resource,estimated_time,prerequisite_skills
Q001,Web Developer,JavaScript,What is React?,Library,Framework,Language,Tool,1,1,Frontend,High,single,Intermediate,React is a JavaScript library,https://example.com/react,React Fundamentals,Official Docs,40,JavaScript Basics
Q002,Data Scientist,Python,Best for ML?,Python,Java,C++,Ruby,1,1,Programming,High,single,Beginner,Python has ML libraries,https://example.com/python,Python for ML,Coursera,60,Python Basics`

  return new NextResponse(template, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="skill-assessment-template.csv"'
    }
  })
}
