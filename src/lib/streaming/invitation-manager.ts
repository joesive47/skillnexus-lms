export interface Invitation {
  id: string
  eventTitle: string
  eventType: 'CLASS' | 'MEETING' | 'DEMO' | 'TUTORING'
  hostId: string
  hostName: string
  inviteeName: string
  inviteeEmail: string
  scheduledAt: Date
  duration: number
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED'
  message?: string
  meetingLink?: string
  createdAt: Date
}

export class InvitationManager {
  static generateLink(eventId: string, inviteeId: string): string {
    const token = Buffer.from(`${eventId}:${inviteeId}:${Date.now()}`).toString('base64')
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/live-classroom/meeting/${eventId}?token=${token}`
  }

  static createInvitation(data: Omit<Invitation, 'id' | 'createdAt' | 'status'>): Invitation {
    return {
      ...data,
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'PENDING',
      createdAt: new Date()
    }
  }

  static getEmailTemplate(invitation: Invitation): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 คำเชิญ: ${invitation.eventTitle}</h1>
    </div>
    <div class="content">
      <p>สวัสดีครับ/ค่ะ <strong>${invitation.inviteeName}</strong>,</p>
      
      <div class="info-box">
        <p><strong>📅 วันที่:</strong> ${new Date(invitation.scheduledAt).toLocaleDateString('th-TH')}</p>
        <p><strong>⏱️ ระยะเวลา:</strong> ${invitation.duration} นาที</p>
        <p><strong>🎯 หัวข้อ:</strong> ${invitation.eventTitle}</p>
        <p><strong>👤 ผู้สอน:</strong> ${invitation.hostName}</p>
      </div>

      ${invitation.message ? `<p>${invitation.message}</p>` : ''}

      <div style="text-align: center;">
        <a href="${invitation.meetingLink}" class="button">เข้าร่วมห้องเรียน</a>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim()
  }

  static async sendInvitation(invitation: Invitation): Promise<boolean> {
    try {
      const response = await fetch('/api/streaming/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invitation)
      })
      return response.ok
    } catch (error) {
      console.error('Error sending invitation:', error)
      return false
    }
  }
}
