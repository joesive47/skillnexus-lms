"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { User, Mail, Phone, MapPin, Building, GraduationCap } from "lucide-react"
import { registerUser } from "@/app/actions/auth"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    titleTh: "",
    firstName: "",
    lastName: "",
    titleEn: "",
    firstNameEn: "",
    lastNameEn: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    occupation: "",
    education: "",
    interests: "",
    agreeTerms: false
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน")
      setIsLoading(false)
      return
    }

    if (!formData.agreeTerms) {
      setError("กรุณายอมรับเงื่อนไขการใช้งาน")
      setIsLoading(false)
      return
    }

    if (!formData.firstNameEn || !formData.lastNameEn) {
      setError("กรุณากรอกชื่อ-นามสกุลภาษาอังกฤษสำหรับใบประกาศนียบัตร")
      setIsLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('titleTh', formData.titleTh)
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('titleEn', formData.titleEn)
      formDataToSend.append('firstNameEn', formData.firstNameEn)
      formDataToSend.append('lastNameEn', formData.lastNameEn)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('birthDate', formData.dateOfBirth)
      formDataToSend.append('gender', formData.gender)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('province', formData.province)
      formDataToSend.append('postalCode', formData.postalCode)
      formDataToSend.append('occupation', formData.occupation)
      formDataToSend.append('education', formData.education)
      
      const result = await registerUser(formDataToSend)
      
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login?registered=true")
        }, 2000)
      } else {
        setError(result.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก")
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการสมัครสมาชิก")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center">สมัครสมาชิก SkillNexus</CardTitle>
        <CardDescription className="text-center">
          กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้งานใหม่
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ข้อมูลส่วนตัว */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">ข้อมูลส่วนตัว</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titleTh">คำนำหน้า (ไทย)</Label>
                <Select onValueChange={(value) => handleInputChange("titleTh", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกคำนำหน้า" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="นาย">นาย</SelectItem>
                    <SelectItem value="นาง">นาง</SelectItem>
                    <SelectItem value="นางสาว">นางสาว</SelectItem>
                    <SelectItem value="เด็กชาย">เด็กชาย</SelectItem>
                    <SelectItem value="เด็กหญิง">เด็กหญิง</SelectItem>
                    <SelectItem value="ดร.">ดร.</SelectItem>
                    <SelectItem value="ศ.ดร.">ศ.ดร.</SelectItem>
                    <SelectItem value="รศ.ดร.">รศ.ดร.</SelectItem>
                    <SelectItem value="ผศ.ดร.">ผศ.ดร.</SelectItem>
                    <SelectItem value="อาจารย์">อาจารย์</SelectItem>
                    <SelectItem value="ครู">ครู</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">ชื่อ (ไทย) *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="ทวีศักดิ์"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">นามสกุล (ไทย) *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="เจริญศิลป์"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titleEn">คำนำหน้า (อังกฤษ)</Label>
                <Select onValueChange={(value) => handleInputChange("titleEn", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                    <SelectItem value="Prof.">Prof.</SelectItem>
                    <SelectItem value="Assoc. Prof.">Assoc. Prof.</SelectItem>
                    <SelectItem value="Asst. Prof.">Asst. Prof.</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstNameEn">ชื่อ (อังกฤษ) *</Label>
                <Input
                  id="firstNameEn"
                  value={formData.firstNameEn}
                  onChange={(e) => handleInputChange("firstNameEn", e.target.value)}
                  placeholder="Taweesak"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastNameEn">นามสกุล (อังกฤษ) *</Label>
                <Input
                  id="lastNameEn"
                  value={formData.lastNameEn}
                  onChange={(e) => handleInputChange("lastNameEn", e.target.value)}
                  placeholder="Jaroensin"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">วันเกิด</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">เพศ</Label>
                <Select onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเพศ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ชาย</SelectItem>
                    <SelectItem value="female">หญิง</SelectItem>
                    <SelectItem value="other">อื่นๆ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">ข้อมูลติดต่อ</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="081-234-5678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">ที่อยู่</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="บ้านเลขที่ ซอย ถนน"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">อำเภอ/เขต</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="อำเภอ/เขต"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">จังหวัด</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => handleInputChange("province", e.target.value)}
                  placeholder="จังหวัด"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">รหัสไปรษณีย์</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  placeholder="12345"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลการศึกษาและอาชีพ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">ข้อมูลการศึกษาและอาชีพ</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">ระดับการศึกษา</Label>
              <Select onValueChange={(value) => handleInputChange("education", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกระดับการศึกษา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">มัธยมศึกษา</SelectItem>
                  <SelectItem value="diploma">ปวช./ปวส.</SelectItem>
                  <SelectItem value="bachelor">ปริญญาตรี</SelectItem>
                  <SelectItem value="master">ปริญญาโท</SelectItem>
                  <SelectItem value="doctorate">ปริญญาเอก</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">อาชีพ</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange("occupation", e.target.value)}
                placeholder="อาชีพปัจจุบัน"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">ความสนใจ/ทักษะที่ต้องการพัฒนา</Label>
              <Textarea
                id="interests"
                value={formData.interests}
                onChange={(e) => handleInputChange("interests", e.target.value)}
                placeholder="เช่น การเขียนโปรแกรม, การตลาดดิจิทัล, ภาษาอังกฤษ"
                rows={3}
              />
            </div>
          </div>

          {/* รหัสผ่าน */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="สร้างรหัสผ่าน"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="ยืนยันรหัสผ่าน"
                  required
                />
              </div>
            </div>
          </div>

          {/* เงื่อนไขการใช้งาน */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
            />
            <Label htmlFor="agreeTerms" className="text-sm">
              ฉันยอมรับ{" "}
              <Link href="/terms" className="text-primary hover:underline">
                เงื่อนไขการใช้งาน
              </Link>{" "}
              และ{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                นโยบายความเป็นส่วนตัว
              </Link>
            </Label>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              สมัครสมาชิกสำเร็จ! กำลังนำทางไปหน้าเข้าสู่ระบบ...
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || success}>
            {isLoading ? "กำลังสมัครสมาชิก..." : success ? "สมัครสมาชิกสำเร็จ" : "สมัครสมาชิก"}
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-muted-foreground">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}