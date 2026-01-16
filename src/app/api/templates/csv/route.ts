import { NextResponse } from 'next/server'

export async function GET() {
  const template = `question_id,career_title,skill_name,question_text,option_1,option_2,option_3,option_4,correct_answer,score
Q001,Web Developer,JavaScript,What is React?,Library,Framework,Language,Tool,1,1
Q002,Data Scientist,Python,Best for ML?,Python,Java,C++,Ruby,1,1
Q003,DevOps Engineer,Docker,What is Docker?,Container,VM,Cloud,Database,1,1`

  return new NextResponse(template, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="skill-assessment-simple.csv"'
    }
  })
}
