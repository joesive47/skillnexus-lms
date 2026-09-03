// Stub event processor
export class EventProcessor {
  static async processEvent(...args: any[]) {
    return null;
  }
  
  static async processPendingEvents(...args: any[]) {
    return [];
  }
  
  static async cleanupExpiredBadges(...args: any[]) {
    return [];
  }
  
  static async checkExpirations(...args: any[]) {
    return [];
  }
}

export default EventProcessor;