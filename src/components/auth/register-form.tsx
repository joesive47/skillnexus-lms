"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import Image from "next/image"
import { User, Mail, GraduationCap, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"
import { registerUser } from "@/app/actions/auth"

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
      <Icon className="h-4 w-4 text-yellow-600 shrink-0" />
      <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
    </div>
  )
}

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    titleTh: "", firstName: "", lastName: "",
    titleEn: "", firstNameEn: "", lastNameEn: "",
    email: "", phone: "", password: "", confirmPassword: "",
    dateOfBirth: "", gender: "",
    address: "", city: "", province: "", postalCode: "",
    occupation: "", education: "", interests: "",
    agreeTerms: false,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const set = (field: string, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

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
      const fd = new FormData()
      const map: Record<string, string> = {
        titleTh: formData.titleTh, firstName: formData.firstName, lastName: formData.lastName,
        titleEn: formData.titleEn, firstNameEn: formData.firstNameEn, lastNameEn: formData.lastNameEn,
        email: formData.email, phone: formData.phone, password: formData.password,
        birthDate: formData.dateOfBirth, gender: formData.gender,
        address: formData.address, province: formData.province, postalCode: formData.postalCode,
        occupation: formData.occupation, education: formData.education,
      }
      Object.entries(map).forEach(([k, v]) => fd.append(k, v))

      const result = await registerUser(fd)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => router.push("/login?registered=true"), 2000)
      } else {
        setError(result.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก")
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <Image src="/logoupPowerskill.png" alt="upPowerSkill" width={56} height={56} className="object-contain" priority />
      </div>
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">สมัครสมาชิก upPowerSkill</h2>
        <p className="text-sm text-gray-500 mt-1">กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้งานใหม่</p>
      </div>

      {/* ── ข้อมูลส่วนตัว ── */}
      <div className="space-y-4">
        <SectionHeader icon={User} label="ข้อมูลส่วนตัว" />

        {/* แถวไทย: คำนำหน้า + ชื่อ + นามสกุล */}
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr] gap-3">
          <div className="space-y-1.5">
            <Label>คำนำหน้า (ไทย)</Label>
            <Select onValueChange={v => set("titleTh", v)}>
              <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
              <SelectContent>
                {["นาย","นาง","นางสาว","เด็กชาย","เด็กหญิง","ดร.","ศ.ดร.","รศ.ดร.","ผศ.ดร.","อาจารย์","ครู"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="firstName">ชื่อ (ไทย) <span className="text-red-500">*</span></Label>
            <Input id="firstName" value={formData.firstName} onChange={e => set("firstName", e.target.value)} placeholder="ทวีศักดิ์" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">นามสกุล (ไทย) <span className="text-red-500">*</span></Label>
            <Input id="lastName" value={formData.lastName} onChange={e => set("lastName", e.target.value)} placeholder="เจริญศิลป์" required />
          </div>
        </div>

        {/* แถวอังกฤษ */}
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr] gap-3">
          <div className="space-y-1.5">
            <Label>คำนำหน้า (EN)</Label>
            <Select onValueChange={v => set("titleEn", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["Mr.","Mrs.","Miss","Ms.","Dr.","Prof.","Assoc. Prof.","Asst. Prof.","Master"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="firstNameEn">ชื่อ (EN) <span className="text-red-500">*</span></Label>
            <Input id="firstNameEn" value={formData.firstNameEn} onChange={e => set("firstNameEn", e.target.value)} placeholder="Taweesak" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastNameEn">นามสกุล (EN) <span className="text-red-500">*</span></Label>
            <Input id="lastNameEn" value={formData.lastNameEn} onChange={e => set("lastNameEn", e.target.value)} placeholder="Jaroensin" required />
          </div>
        </div>

        {/* วันเกิด + เพศ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth">วันเกิด</Label>
            <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>เพศ</Label>
            <Select onValueChange={v => set("gender", v)}>
              <SelectTrigger><SelectValue placeholder="เลือกเพศ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">ชาย</SelectItem>
                <SelectItem value="female">หญิง</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── ข้อมูลติดต่อ ── */}
      <div className="space-y-4">
        <SectionHeader icon={Mail} label="ข้อมูลติดต่อ" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">อีเมล <span className="text-red-500">*</span></Label>
            <Input id="email" type="email" value={formData.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">เบอร์โทรศัพท์ <span className="text-red-500">*</span></Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={e => set("phone", e.target.value)} placeholder="081-234-5678" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">ที่อยู่</Label>
          <Textarea id="address" value={formData.address} onChange={e => set("address", e.target.value)} placeholder="บ้านเลขที่ ซอย ถนน" rows={2} className="resize-none" />
        </div>

        {/* อำเภอ จังหวัด รหัสไปรษณีย์ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="city">อำเภอ/เขต</Label>
            <Input id="city" value={formData.city} onChange={e => set("city", e.target.value)} placeholder="อำเภอ/เขต" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="province">จังหวัด</Label>
            <Input id="province" value={formData.province} onChange={e => set("province", e.target.value)} placeholder="จังหวัด" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="postalCode">รหัสไปรษณีย์</Label>
            <Input id="postalCode" value={formData.postalCode} onChange={e => set("postalCode", e.target.value)} placeholder="10400" maxLength={5} />
          </div>
        </div>
      </div>

      {/* ── การศึกษาและอาชีพ ── */}
      <div className="space-y-4">
        <SectionHeader icon={GraduationCap} label="การศึกษาและอาชีพ" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>ระดับการศึกษา</Label>
            <Select onValueChange={v => set("education", v)}>
              <SelectTrigger><SelectValue placeholder="เลือกระดับการศึกษา" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">มัธยมศึกษา</SelectItem>
                <SelectItem value="diploma">ปวช./ปวส.</SelectItem>
                <SelectItem value="bachelor">ปริญญาตรี</SelectItem>
                <SelectItem value="master">ปริญญาโท</SelectItem>
                <SelectItem value="doctorate">ปริญญาเอก</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="occupation">อาชีพ</Label>
            <Input id="occupation" value={formData.occupation} onChange={e => set("occupation", e.target.value)} placeholder="อาชีพปัจจุบัน" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="interests">ความสนใจ / ทักษะที่ต้องการพัฒนา</Label>
          <Textarea id="interests" value={formData.interests} onChange={e => set("interests", e.target.value)} placeholder="เช่น การเขียนโปรแกรม, การตลาดดิจิทัล, ภาษาอังกฤษ" rows={2} className="resize-none" />
        </div>
      </div>

      {/* ── รหัสผ่าน ── */}
      <div className="space-y-4">
        <SectionHeader icon={Lock} label="รหัสผ่าน" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="password">รหัสผ่าน <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="password" type={showPassword ? "text" : "password"}
                value={formData.password} onChange={e => set("password", e.target.value)}
                placeholder="อย่างน้อย 8 ตัวอักษร" required className="pr-10"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="confirmPassword" type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                placeholder="ยืนยันรหัสผ่าน" required className="pr-10"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── เงื่อนไข ── */}
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <Checkbox
          id="agreeTerms" checked={formData.agreeTerms}
          onCheckedChange={v => set("agreeTerms", v as boolean)}
          className="mt-0.5 shrink-0"
        />
        <Label htmlFor="agreeTerms" className="text-sm leading-relaxed cursor-pointer">
          ฉันได้อ่านและยอมรับ{" "}
          <Link href="/terms" className="text-blue-600 hover:underline font-medium">เงื่อนไขการใช้งาน</Link>
          {" "}และ{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline font-medium">นโยบายความเป็นส่วนตัว</Link>
        </Label>
      </div>

      {/* Error / Success */}
      {error && (
        <div className="flex items-start gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>สมัครสมาชิกสำเร็จ! กำลังนำทางไปหน้าเข้าสู่ระบบ...</span>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 transition-all"
        disabled={isLoading || success}
      >
        {isLoading ? "กำลังสมัครสมาชิก..." : success ? "สมัครสมาชิกสำเร็จ ✓" : "สมัครสมาชิกฟรี"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="text-blue-600 hover:underline font-semibold">เข้าสู่ระบบ</Link>
      </p>
    </form>
  )
}
