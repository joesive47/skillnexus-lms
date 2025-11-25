import { Award, Calendar } from "lucide-react"

interface CertificateTemplate1Props {
  titlePrefix?: string
  studentNameTh?: string
  studentNameEn?: string
  studentName?: string
  courseName: string
  issueDate: string
  certificateId: string
}

export default function CertificateTemplate1({ 
  titlePrefix,
  studentNameTh,
  studentNameEn,
  studentName, 
  courseName, 
  issueDate, 
  certificateId 
}: CertificateTemplate1Props) {
  const displayName = titlePrefix && studentNameTh && studentNameEn 
    ? `${titlePrefix}${studentNameTh}\n${studentNameEn}`
    : studentName || 'ชื่อนักเรียน'
  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl">
      {/* Certificate Container */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-12">
        {/* Decorative Border */}
        <div className="absolute inset-4 border-4 border-white/30 rounded-lg"></div>
        <div className="absolute inset-6 border-2 border-white/20 rounded-lg"></div>
        
        {/* Header */}
        <div className="relative z-10 text-center text-white mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Certificate of Completion</h1>
          <div className="w-32 h-1 bg-white/50 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white space-y-6">
          <p className="text-lg opacity-90">This is to certify that</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl font-bold mb-4 whitespace-pre-line leading-tight">
              {displayName}
            </div>
            <p className="text-lg opacity-90 mb-4">has successfully completed the course</p>
            <h3 className="text-2xl font-semibold">{courseName}</h3>
          </div>

          <p className="text-lg opacity-90">
            Awarded by <strong>SkillNexus LMS</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-end mt-12 text-white">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm opacity-80">Issue Date</span>
            </div>
            <div className="text-lg font-semibold">{issueDate}</div>
          </div>
          
          <div className="text-center">
            <div className="w-32 h-1 bg-white/50 mb-2"></div>
            <div className="text-sm opacity-80">Authorized Signature</div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-80 mb-2">Certificate ID</div>
            <div className="text-lg font-mono font-semibold">{certificateId}</div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-8 right-8 w-24 h-24 border-2 border-white/20 rounded-full"></div>
        <div className="absolute bottom-8 left-8 w-20 h-20 border-2 border-white/20 rounded-full"></div>
        <div className="absolute top-16 left-16 w-16 h-16 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-16 right-16 w-12 h-12 border border-white/10 rounded-full"></div>
      </div>
    </div>
  )
}