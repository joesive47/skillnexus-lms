// Stub badge service to fix imports during build
export class BadgeService {
  static async issueBadge(...args: any[]) {
    throw new Error("Badge service temporarily disabled");
  }
  
  static async getUserBadges(...args: any[]) {
    return [];
  }
  
  static async getUserSkillBadges(...args: any[]) {
    return [];
  }
  
  static async getUserCertifications(...args: any[]) {
    return [];
  }
  
  static async checkBadgeEligibility(...args: any[]) {
    return { eligible: false, reason: "Service disabled" };
  }
  
  static async checkAllBadgesForUser(...args: any[]) {
    return [];
  }
  
  static async checkSkillBadges(...args: any[]) {
    return [];
  }
  
  static async getBadgeByVerifyCode(...args: any[]) {
    return null;
  }
  
  static async verifyCertificate(...args: any[]) {
    return null;
  }

  // Instance methods for compatibility
  async issueBadge(...args: any[]) {
    return BadgeService.issueBadge(...args);
  }
  
  async getUserBadges(...args: any[]) {
    return BadgeService.getUserBadges(...args);
  }
  
  async getUserSkillBadges(...args: any[]) {
    return BadgeService.getUserSkillBadges(...args);
  }
  
  async getUserCertifications(...args: any[]) {
    return BadgeService.getUserCertifications(...args);
  }
  
  async checkAllBadgesForUser(...args: any[]) {
    return BadgeService.checkAllBadgesForUser(...args);
  }
  
  async checkSkillBadges(...args: any[]) {
    return BadgeService.checkSkillBadges(...args);
  }
  
  async getBadgeByVerifyCode(...args: any[]) {
    return BadgeService.getBadgeByVerifyCode(...args);
  }
}

export default BadgeService;