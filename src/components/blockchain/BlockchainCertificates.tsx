'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Link, 
  Download, 
  Share2, 
  CheckCircle, 
  Clock,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react'

interface BlockchainCertificate {
  id: string
  title: string
  courseName: string
  studentName: string
  issueDate: Date
  blockchainHash: string
  transactionId: string
  verified: boolean
  ipfsHash: string
  metadata: {
    skills: string[]
    grade: string
    duration: string
  }
}

export default function BlockchainCertificates() {
  const [certificates, setCertificates] = useState<BlockchainCertificate[]>([])
  const [selectedCert, setSelectedCert] = useState<BlockchainCertificate | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    setCertificates([
      {
        id: '1',
        title: 'JavaScript Developer Certificate',
        courseName: 'JavaScript Fundamentals',
        studentName: 'นายสมชาย ใจดี',
        issueDate: new Date('2024-01-15'),
        blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
        transactionId: '0xabcdef1234567890abcdef1234567890abcdef12',
        verified: true,
        ipfsHash: 'QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T',
        metadata: {
          skills: ['JavaScript', 'ES6+', 'DOM Manipulation'],
          grade: 'A',
          duration: '40 ชั่วโมง'
        }
      },
      {
        id: '2',
        title: 'React Developer Certificate',
        courseName: 'React Development',
        studentName: 'นางสาวมาลี สวยงาม',
        issueDate: new Date('2024-01-20'),
        blockchainHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef123',
        transactionId: '0xbcdef1234567890abcdef1234567890abcdef123',
        verified: true,
        ipfsHash: 'QmY2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U',
        metadata: {
          skills: ['React', 'JSX', 'Hooks', 'State Management'],
          grade: 'A+',
          duration: '60 ชั่วโมง'
        }
      }
    ])
  }, [])

  const verifyCertificate = async (cert: BlockchainCertificate) => {
    setIsVerifying(true)
    setSelectedCert(cert)
    
    // Simulate blockchain verification
    setTimeout(() => {
      setIsVerifying(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadCertificate = (cert: BlockchainCertificate) => {
    // Generate certificate download
    const certData = {
      ...cert,
      verificationUrl: `https://skillnexus.com/verify/${cert.blockchainHash}`
    }
    
    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `certificate-${cert.id}.json`
    a.click()
  }

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Shield className="w-8 h-8 mr-3 text-green-400" />
            Blockchain Certificates
          </h1>
          <p className="text-gray-400 mt-1">ใบรับรองที่ยืนยันด้วย Blockchain Technology</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600">
          <Link className="w-4 h-4 mr-2" />
          เชื่อมต่อ Wallet
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">ใบรับรองของคุณ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{cert.title}</h3>
                      <p className="text-gray-400 text-sm">{cert.courseName}</p>
                      <p className="text-gray-500 text-xs">
                        ออกให้เมื่อ {cert.issueDate.toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <Badge className={cert.verified ? 'bg-green-600' : 'bg-yellow-600'}>
                      {cert.verified ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Blockchain Hash:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-green-400 text-xs">
                          {cert.blockchainHash.slice(0, 10)}...
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyToClipboard(cert.blockchainHash)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {cert.metadata.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => verifyCertificate(cert)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      ตรวจสอบ
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadCertificate(cert)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      ดาวน์โหลด
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-3 h-3 mr-1" />
                      แชร์
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedCert && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Certificate Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isVerifying ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">กำลังตรวจสอบบน Blockchain...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-600/20 border border-green-500 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Certificate Verified</span>
                      </div>
                      <p className="text-green-300 text-sm">
                        ใบรับรองนี้ได้รับการยืนยันบน Ethereum Blockchain
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">Certificate Title</label>
                        <p className="text-white font-medium">{selectedCert.title}</p>
                      </div>
                      
                      <div>
                        <label className="text-gray-400 text-sm">Student Name</label>
                        <p className="text-white font-medium">{selectedCert.studentName}</p>
                      </div>
                      
                      <div>
                        <label className="text-gray-400 text-sm">Issue Date</label>
                        <p className="text-white font-medium">
                          {selectedCert.issueDate.toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-gray-400 text-sm">Grade</label>
                        <Badge className="bg-yellow-600 ml-2">
                          {selectedCert.metadata.grade}
                        </Badge>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm">Blockchain Transaction</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-green-400 text-xs bg-gray-700 p-2 rounded">
                            {selectedCert.transactionId}
                          </code>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm">IPFS Hash</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-blue-400 text-xs bg-gray-700 p-2 rounded">
                            {selectedCert.ipfsHash}
                          </code>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Blockchain Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <h4 className="text-white font-medium">Tamper-Proof</h4>
                  <p className="text-gray-400 text-sm">ไม่สามารถแก้ไขหรือปลอมแปลงได้</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <Link className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="text-white font-medium">Decentralized</h4>
                  <p className="text-gray-400 text-sm">ไม่ขึ้นอยู่กับองค์กรใดองค์กรหนึ่ง</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="text-white font-medium">Instantly Verifiable</h4>
                  <p className="text-gray-400 text-sm">ตรวจสอบได้ทันทีทุกที่ทุกเวลา</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}