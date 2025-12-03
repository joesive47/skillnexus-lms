import { BrandingConfig } from './branding'

export function getEmailTemplate(type: 'welcome' | 'certificate' | 'enrollment', branding: BrandingConfig) {
  const templates = {
    welcome: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${branding.primaryColor}; padding: 40px; text-align: center;">
          <img src="${branding.logo}" alt="${branding.name}" style="max-width: 200px;" />
          <h1 style="color: white; margin: 20px 0;">Welcome to ${branding.name}!</h1>
        </div>
        <div style="padding: 40px; background: #f9fafb;">
          <p>Thank you for joining ${branding.name}. Start your learning journey today!</p>
        </div>
      </div>
    `,
    
    certificate: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${branding.primaryColor}; padding: 40px; text-align: center;">
          <h1 style="color: white;">🎉 Congratulations!</h1>
        </div>
        <div style="padding: 40px;">
          <p>Your certificate from ${branding.name} is ready!</p>
        </div>
      </div>
    `,
    
    enrollment: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${branding.primaryColor}; padding: 40px; text-align: center;">
          <h1 style="color: white;">✅ Enrollment Confirmed</h1>
        </div>
        <div style="padding: 40px;">
          <p>You're enrolled in a course at ${branding.name}!</p>
        </div>
      </div>
    `
  }
  
  return templates[type]
}
