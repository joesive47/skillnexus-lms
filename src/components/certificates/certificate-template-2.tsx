import { Crown, Calendar, Star } from "lucide-react"

interface CertificateTemplate2Props {
  titlePrefix?: string
  studentNameTh?: string
  studentNameEn?: string
  studentName?: string
  courseName: string
  issueDate: string
  certificateId: string
}

export default function CertificateTemplate2({ 
  titlePrefix,
  studentNameTh,
  studentNameEn,
  studentName, 
  courseName, 
  issueDate, 
  certificateId 
}: CertificateTemplate2Props) {
  const displayName = titlePrefix && studentNameTh && studentNameEn 
    ? `${titlePrefix}${studentNameTh}\n${studentNameEn}`
    : studentName || 'ชื่อนักเรียน'
  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl">
      {/* Certificate Container */}
      <div className="relative bg-gradient-to-br from-yellow-500 to-orange-600 p-12">
        {/* Decorative Border with Gold Effect */}
        <div className="absolute inset-4 border-4 border-yellow-200/50 rounded-lg shadow-inner"></div>
        <div className="absolute inset-6 border-2 border-yellow-100/30 rounded-lg"></div>
        
        {/* Corner Decorations */}
        <div className="absolute top-8 left-8 w-8 h-8 border-2 border-yellow-200/50 rotate-45"></div>
        <div className="absolute top-8 right-8 w-8 h-8 border-2 border-yellow-200/50 rotate-45"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 border-2 border-yellow-200/50 rotate-45"></div>
        <div className="absolute bottom-8 right-8 w-6 h-6 border-2 border-yellow-200/50 rotate-45"></div>
        
        {/* Header */}
        <div className="relative z-10 text-center text-white mb-8">
          <div className="w-24 h-24 bg-yellow-200/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border-2 border-yellow-200/30">
            <Crown className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-bold mb-2 text-shadow-lg">Premium Certificate</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 fill-current" />
            <div className="w-32 h-1 bg-yellow-200/50"></div>
            <Star className="w-6 h-6 fill-current" />
          </div>
          <p className="text-xl opacity-90">Certificate of Excellence</p>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white space-y-8">
          <p className="text-xl opacity-90">This premium certificate is awarded to</p>
          
          <div className="bg-yellow-200/10 backdrop-blur-sm rounded-xl p-8 border-2 border-yellow-200/30 shadow-lg">
            <div className="text-4xl font-bold mb-6 text-shadow-md whitespace-pre-line leading-tight">
              {displayName}
            </div>
            <p className="text-xl opacity-90 mb-6">for outstanding achievement in</p>
            <h3 className="text-3xl font-semibold text-shadow-md">{courseName}</h3>
            <div className="flex justify-center gap-2 mt-6">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>

          <p className="text-xl opacity-90">
            Presented by <strong className="text-2xl">upPowerSkill LMS</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-end mt-12 text-white">
          <div className="text-left bg-yellow-200/10 backdrop-blur-sm rounded-lg p-4 border border-yellow-200/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm opacity-80">Awarded On</span>
            </div>
            <div className="text-xl font-bold">{issueDate}</div>
          </div>
          
          <div className="text-center">
            <div className="w-40 h-1 bg-yellow-200/50 mb-4"></div>
            <div className="text-lg opacity-90 font-semibold">Director's Signature</div>
            <Crown className="w-6 h-6 mx-auto mt-2" />
          </div>
          
          <div className="text-right bg-yellow-200/10 backdrop-blur-sm rounded-lg p-4 border border-yellow-200/30">
            <div className="text-sm opacity-80 mb-2">Premium ID</div>
            <div className="text-xl font-mono font-bold">{certificateId}</div>
          </div>
        </div>

        {/* Premium Decorative Elements */}
        <div className="absolute top-12 right-12 w-20 h-20 border-2 border-yellow-200/30 rounded-full"></div>
        <div className="absolute bottom-12 left-12 w-16 h-16 border-2 border-yellow-200/30 rounded-full"></div>
        <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-200/30 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-yellow-200/30 rounded-full"></div>
      </div>
    </div>
  )
}