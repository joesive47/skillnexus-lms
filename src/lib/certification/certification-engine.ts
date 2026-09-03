// Stub certification engine
export class CertificationEngine {
  static async getCertificationProgress(...args: any[]) {
    return { progress: 0, total: 0 };
  }
  
  static async checkAndIssueCertifications(...args: any[]) {
    return [];
  }
}

export default CertificationEngine;