// Stub badge engine
export class BadgeEngine {
  static async evaluateCriteria(...args: any[]) {
    return { eligible: false, reason: "Service disabled" };
  }
  
  static async checkAndIssueBadges(...args: any[]) {
    return [];
  }
  
  static async issueBadge(...args: any[]) {
    return null;
  }
}

export default BadgeEngine;