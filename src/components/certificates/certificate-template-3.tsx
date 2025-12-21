import { Shield, Calendar, Zap, Code } from "lucide-react"

interface CertificateTemplate3Props {
  titlePrefix?: string
  studentNameTh?: string
  studentNameEn?: string
  studentName?: string
  courseName: string
  issueDate: string
  certificateId: string
}

export default function CertificateTemplate3({ 
  titlePrefix,
  studentNameTh,
  studentNameEn,
  studentName, 
  courseName, 
  issueDate, 
  certificateId 
}: CertificateTemplate3Props) {
  const displayName = titlePrefix && studentNameTh && studentNameEn 
    ? `${titlePrefix}${studentNameTh}\n${studentNameEn}`
    : studentName || 'ชื่อนักเรียน'
  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl">
      {/* Certificate Container */}
      <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-12 overflow-hidden">
        {/* Modern Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full gap-4">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="bg-white/20 rounded-sm"></div>
            ))}
          </div>
        </div>
        
        {/* Geometric Decorations */}
        <div className="absolute top-6 right-6 w-4 h-4 bg-white/30 rounded-full"></div>
        <div className="absolute top-12 right-12 w-3 h-3 bg-white/20 rounded-full"></div>
        <div className="absolute top-20 right-8 w-2 h-2 bg-white/40 rounded-full"></div>
        <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/20 rotate-45"></div>
        <div className="absolute bottom-12 left-12 w-4 h-4 bg-white/30 rotate-45"></div>
        
        {/* Header */}
        <div className="relative z-10 text-center text-white mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30 rotate-3 hover:rotate-0 transition-transform">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-wide">TECH CERTIFICATE</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-1 bg-white/50 skew-x-12"></div>
            <Code className="w-6 h-6" />
            <div className="w-8 h-1 bg-white/50 -skew-x-12"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5" />
            <p className="text-lg opacity-90">Digital Certification</p>
            <Zap className="w-5 h-5" />
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-transform">
            <div className="bg-gradient-to-r from-white/20 to-transparent rounded-lg p-6 mb-6">
              <div className="text-3xl font-bold mb-4 tracking-wide whitespace-pre-line leading-tight">
                {displayName}
              </div>
            </div>
            <p className="text-lg opacity-90 mb-4">has mastered the technology course</p>
            <h3 className="text-2xl font-semibold mb-4">{courseName}</h3>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" />
            <p className="text-lg opacity-90">
              Verified by <strong>upPowerSkill Tech Academy</strong>
            </p>
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-12 text-white">
          <div className="grid grid-cols-3 gap-8 items-end">
            <div className="text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm opacity-80">Issued</span>
                </div>
                <div className="text-lg font-semibold">{issueDate}</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mb-2"></div>
              <div className="text-sm opacity-80">Digital Signature</div>
              <div className="mt-2 flex justify-center">
                <div className="w-8 h-8 bg-white/20 rounded border border-white/30 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-sm opacity-80 mb-2">Tech ID</div>
                <div className="text-lg font-mono font-semibold">{certificateId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Decorative Elements */}
        <div className="absolute top-16 right-16 w-16 h-16 border border-white/20 rounded-lg rotate-12"></div>
        <div className="absolute bottom-16 left-16 w-12 h-12 border border-white/20 rounded-lg -rotate-12"></div>
        <div className="absolute top-32 left-32 w-1 h-16 bg-white/20 rotate-45"></div>
        <div className="absolute bottom-32 right-32 w-1 h-12 bg-white/20 -rotate-45"></div>
      </div>
    </div>
  )
}