'use client';

interface CertificationKey {
  name: string;
  score: number;
  hours: number;
  duration: string;
}

interface BardCertificateProps {
  recipientName: string;
  pathName: string;
  certificationKeys: CertificationKey[];
  issueDate: string;
  certificateId: string;
  qrCodeUrl?: string;
}

export function BardCertificateTemplate({
  recipientName,
  pathName,
  certificationKeys,
  issueDate,
  certificateId,
  qrCodeUrl
}: BardCertificateProps) {
  return (
    <div className="w-[210mm] h-[297mm] bg-white p-12 relative overflow-hidden print:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #667eea 0, #667eea 1px, transparent 0, transparent 50%)',
          backgroundSize: '10px 10px'
        }} />
      </div>

      {/* Gold Border */}
      <div className="absolute inset-4 border-4 border-[#d4af37] rounded-lg" />
      <div className="absolute inset-6 border border-[#d4af37] rounded-lg" />

      {/* Corner Ornaments */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-[#d4af37] rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-[#d4af37] rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-[#d4af37] rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-[#d4af37] rounded-br-lg" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
            B
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">CERTIFICATE OF ACHIEVEMENT</h1>
          <p className="text-xl text-purple-600 font-semibold">BARD CERTIFICATION SYSTEM</p>
        </div>

        {/* Recipient */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 mb-2">This certificate is proudly presented to</p>
          <h2 className="text-3xl font-serif font-bold text-gray-800 border-b-2 border-[#d4af37] inline-block px-8 pb-2">
            {recipientName}
          </h2>
        </div>

        {/* Path */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-semibold text-purple-700">{pathName}</span>
          </div>
        </div>

        {/* Certification Keys Section */}
        <div className="mb-6 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-200">
          <h3 className="text-2xl font-bold text-center mb-2 text-purple-700">🔑 Certification Keys Unlocked</h3>
          <p className="text-center text-sm text-gray-600 mb-4">
            Each certification represents a key to unlock your {pathName} expertise
          </p>

          {/* Visual Formula */}
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            {certificationKeys.map((key, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-lg shadow-md border-2 border-green-500 hover:scale-105 transition-transform">
                  <div className="text-3xl mb-1">🔑</div>
                  <div className="text-xs font-semibold text-gray-700 text-center">{key.name}</div>
                  <div className="text-xs bg-green-500 text-white px-2 py-1 rounded mt-1 text-center">CERTIFIED</div>
                </div>
                {index < certificationKeys.length - 1 && (
                  <span className="text-2xl font-bold text-purple-600">+</span>
                )}
              </div>
            ))}
            <span className="text-2xl font-bold text-purple-600">=</span>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-lg shadow-lg border-4 border-[#d4af37]">
              <div className="text-4xl">🏆</div>
              <div className="text-xs font-bold text-white text-center mt-1">MASTER</div>
            </div>
          </div>
        </div>

        {/* Module Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {certificationKeys.map((key, index) => (
            <div key={index} className="border-2 border-purple-300 rounded-lg p-3 bg-white">
              <h4 className="font-bold text-sm text-purple-700 mb-1">{key.name}</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>⏱️ {key.hours} hours • {key.duration}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${key.score}%` }}
                    />
                  </div>
                  <span className="font-bold text-green-600">{key.score}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t-2 border-gray-300">
          <div className="flex justify-between items-end">
            <div className="text-center">
              <div className="border-t-2 border-gray-800 w-48 mb-2" />
              <p className="text-sm font-semibold">Program Director</p>
              <p className="text-xs text-gray-600">BARD Certification Authority</p>
            </div>
            
            <div className="text-center">
              {qrCodeUrl && (
                <div className="w-20 h-20 bg-gray-200 mb-2 flex items-center justify-center text-xs">
                  QR Code
                </div>
              )}
              <p className="text-xs text-gray-600">Issue Date: {issueDate}</p>
              <p className="text-xs font-mono text-gray-500">{certificateId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
