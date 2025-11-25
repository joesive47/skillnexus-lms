import SkillAssessmentResults from '@/components/skill-assessment/skill-assessment-results'

// Sample data for demonstration
const sampleSkillData = [
  { name: 'JavaScript', score: 85, average: 75 },
  { name: 'React', score: 78, average: 70 },
  { name: 'Node.js', score: 72, average: 68 },
  { name: 'Database', score: 65, average: 72 },
  { name: 'DevOps', score: 58, average: 65 },
  { name: 'Testing', score: 70, average: 67 }
]

export default function SkillAssessmentResultsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Skill Assessment Results</h1>
      <SkillAssessmentResults
        assessmentId="sample-assessment-id"
        skillData={sampleSkillData}
        overallScore={71.3}
        level="Intermediate"
        assessmentTitle="Full Stack Developer Assessment"
        date={new Date().toLocaleDateString()}
        timeSpent="45 นาที"
        percentile={75}
        avgTimePerQuestion="1.5 นาที"
        accuracy={85}
      />
    </div>
  )
}