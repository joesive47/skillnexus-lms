import { Resend } from 'resend'

let resend: Resend | null = null

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export async function sendWelcomeEmail(to: string, name: string) {
  const client = getResend()
  if (!client) return
  
  try {
    await client.emails.send({
      from: 'SkillNexus LMS <onboarding@skillnexus.com>',
      to,
      subject: 'Welcome to SkillNexus LMS! 🎓',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to SkillNexus! 🚀</h1>
          </div>
          <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hi ${name}! 👋</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for joining SkillNexus LMS - Your gateway to world-class learning!
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3b82f6; margin-top: 0;">🎯 Get Started:</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>Browse 1,000+ courses</li>
                <li>Earn BARD Certificates</li>
                <li>Join live classes</li>
                <li>Connect with mentors</li>
              </ul>
            </div>
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
              Go to Dashboard
            </a>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
              Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_URL}/help" style="color: #3b82f6;">Help Center</a>
            </p>
          </div>
        </div>
      `
    })
  } catch (error) {
    console.error('Welcome email error:', error)
  }
}

export async function sendCertificateEmail(to: string, name: string, courseName: string, certificateNumber: string) {
  const client = getResend()
  if (!client) return
  
  try {
    await client.emails.send({
      from: 'SkillNexus LMS <certificates@skillnexus.com>',
      to,
      subject: `🎓 Your BARD Certificate is Ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
          </div>
          <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hi ${name}! 🎓</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              You've successfully completed <strong>${courseName}</strong> and earned your BARD Certificate!
            </p>
            <div style="background: white; padding: 30px; border-radius: 8px; margin: 20px 0; border: 2px solid #8b5cf6;">
              <h3 style="color: #8b5cf6; margin-top: 0; text-align: center;">Your Certificate</h3>
              <p style="text-align: center; color: #6b7280; margin: 10px 0;">Certificate Number</p>
              <p style="text-align: center; font-family: monospace; font-size: 18px; font-weight: bold; color: #1f2937;">${certificateNumber}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_URL}/api/certificates/download/${certificateNumber}" 
                 style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px;">
                📥 Download PDF
              </a>
              <a href="${process.env.NEXT_PUBLIC_URL}/dashboard/student/bard-certificates" 
                 style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px;">
                View All Certificates
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px; text-align: center;">
              Share your achievement on LinkedIn! 🎯
            </p>
          </div>
        </div>
      `
    })
  } catch (error) {
    console.error('Certificate email error:', error)
  }
}

export async function sendCourseEnrollmentEmail(to: string, name: string, courseName: string) {
  const client = getResend()
  if (!client) return
  
  try {
    await client.emails.send({
      from: 'SkillNexus LMS <courses@skillnexus.com>',
      to,
      subject: `✅ Enrolled in ${courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">You're Enrolled! 🎉</h1>
          </div>
          <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hi ${name}! 📚</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              You've successfully enrolled in <strong>${courseName}</strong>. Let's start learning!
            </p>
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" 
               style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
              Start Learning Now
            </a>
          </div>
        </div>
      `
    })
  } catch (error) {
    console.error('Enrollment email error:', error)
  }
}
