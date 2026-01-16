import { NextResponse } from 'next/server'

export async function GET() {
  const template = `question_id,career_title,skill_name,question_text,option_1,option_2,option_3,option_4,correct_answer,score
Q001,Data Analyst,Basic Digital Skill,คำว่า Prompt หมายถึงอะไร?,ชื่อดาต้าเบส,คำสั่งที่ป้อนให้ AI,ชื่อไฟล์งาน,รหัสผ่าน,2,1
Q002,Data Analyst,Excel Skills,Excel ใช้สูตรอะไรหาค่าเฉลี่ย?,SUM,AVERAGE,COUNT,MAX,2,1
Q003,Data Analyst,Data Analysis,Data Visualization คืออะไร?,การวิเคราะห์ข้อมูล,การแสดงผลข้อมูลด้วยกราฟ,การเก็บข้อมูล,การลบข้อมูล,2,1`

  return new NextResponse(template, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="skill-assessment-simple.csv"'
    }
  })
}
