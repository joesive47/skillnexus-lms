interface ReviewCriteria {
  id: string
  name: string
  description: string
  weight: number // 0-1
  maxScore: number
}

interface PeerReview {
  id: string
  reviewerId: string
  projectId: string
  criteria: ReviewCriteria[]
  scores: Record<string, number>
  feedback: string
  overallRating: number
  timestamp: Date
  status: 'pending' | 'completed' | 'disputed'
}

interface CollaborativeProject {
  id: string
  title: string
  description: string
  creatorId: string
  participants: string[]
  deliverables: ProjectDeliverable[]
  peerReviews: PeerReview[]
  skillsRequired: string[]
  skillsGenerated: string[]
  status: 'planning' | 'active' | 'review' | 'completed'
  deadline: Date
}

interface ProjectDeliverable {
  id: string
  title: string
  description: string
  submittedBy: string
  fileUrl?: string
  submittedAt: Date
  reviewsReceived: number
  averageRating: number
}

export class PeerReviewSystem {
  async createProject(project: Omit<CollaborativeProject, 'id' | 'peerReviews' | 'status'>): Promise<string> {
    const projectId = `proj_${Date.now()}`
    
    const newProject: CollaborativeProject = {
      ...project,
      id: projectId,
      peerReviews: [],
      status: 'planning'
    }
    
    // Save to database
    await this.saveProject(newProject)
    
    // Notify participants
    await this.notifyParticipants(project.participants, 'project_created', projectId)
    
    return projectId
  }

  async submitDeliverable(projectId: string, deliverable: Omit<ProjectDeliverable, 'id' | 'reviewsReceived' | 'averageRating'>): Promise<void> {
    const deliverableId = `deliv_${Date.now()}`
    
    const newDeliverable: ProjectDeliverable = {
      ...deliverable,
      id: deliverableId,
      reviewsReceived: 0,
      averageRating: 0
    }
    
    await this.addDeliverableToProject(projectId, newDeliverable)
    await this.requestPeerReviews(projectId, deliverableId)
  }

  async submitPeerReview(review: Omit<PeerReview, 'id' | 'timestamp' | 'status'>): Promise<void> {
    const reviewId = `review_${Date.now()}`
    
    const newReview: PeerReview = {
      ...review,
      id: reviewId,
      timestamp: new Date(),
      status: 'completed'
    }
    
    // Calculate overall rating
    newReview.overallRating = this.calculateOverallRating(review.criteria, review.scores)
    
    await this.savePeerReview(newReview)
    await this.updateDeliverableRating(review.projectId, newReview)
    
    // Check if project is ready for completion
    await this.checkProjectCompletion(review.projectId)
  }

  async generateSkillPortfolio(userId: string): Promise<SkillPortfolio> {
    const userProjects = await this.getUserProjects(userId)
    const completedReviews = await this.getUserReviews(userId)
    const receivedEndorsements = await this.getUserEndorsements(userId)
    
    const skills = this.extractSkillsFromProjects(userProjects)
    const verifiedSkills = this.verifySkillsWithReviews(skills, completedReviews)
    
    return {
      userId,
      skills: verifiedSkills,
      projects: userProjects.filter(p => p.status === 'completed'),
      endorsements: receivedEndorsements,
      portfolioUrl: `https://skillnexus.com/portfolio/${userId}`,
      lastUpdated: new Date()
    }
  }

  async requestPeerEndorsement(userId: string, skillId: string, endorserId: string): Promise<void> {
    const endorsement: PeerEndorsement = {
      id: `endorse_${Date.now()}`,
      userId,
      skillId,
      endorserId,
      message: '',
      strength: 0,
      timestamp: new Date(),
      verified: false
    }
    
    await this.saveEndorsement(endorsement)
    await this.notifyEndorser(endorserId, userId, skillId)
  }

  private calculateOverallRating(criteria: ReviewCriteria[], scores: Record<string, number>): number {
    let weightedSum = 0
    let totalWeight = 0
    
    criteria.forEach(criterion => {
      const score = scores[criterion.id] || 0
      weightedSum += score * criterion.weight
      totalWeight += criterion.weight
    })
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  private extractSkillsFromProjects(projects: CollaborativeProject[]): VerifiedSkill[] {
    const skillMap = new Map<string, VerifiedSkill>()
    
    projects.forEach(project => {
      project.skillsGenerated.forEach(skill => {
        if (!skillMap.has(skill)) {
          skillMap.set(skill, {
            id: skill,
            name: skill,
            level: 'beginner',
            verificationCount: 0,
            projectsUsed: []
          })
        }
        
        const skillObj = skillMap.get(skill)!
        skillObj.projectsUsed.push(project.id)
        skillObj.verificationCount++
      })
    })
    
    return Array.from(skillMap.values())
  }

  private verifySkillsWithReviews(skills: VerifiedSkill[], reviews: PeerReview[]): VerifiedSkill[] {
    return skills.map(skill => {
      const relevantReviews = reviews.filter(review => 
        review.overallRating >= 4.0 // High-quality reviews only
      )
      
      if (relevantReviews.length >= 3) {
        skill.level = 'advanced'
      } else if (relevantReviews.length >= 1) {
        skill.level = 'intermediate'
      }
      
      return skill
    })
  }

  // Mock database operations
  private async saveProject(project: CollaborativeProject): Promise<void> {
    console.log('💾 Project saved:', project.id)
  }

  private async savePeerReview(review: PeerReview): Promise<void> {
    console.log('📝 Review saved:', review.id)
  }

  private async notifyParticipants(participants: string[], type: string, projectId: string): Promise<void> {
    console.log(`📢 Notified ${participants.length} participants about ${type}`)
  }

  private async getUserProjects(userId: string): Promise<CollaborativeProject[]> {
    return [] // Mock
  }

  private async getUserReviews(userId: string): Promise<PeerReview[]> {
    return [] // Mock
  }

  private async getUserEndorsements(userId: string): Promise<PeerEndorsement[]> {
    return [] // Mock
  }

  private async addDeliverableToProject(projectId: string, deliverable: ProjectDeliverable): Promise<void> {
    console.log(`📎 Added deliverable ${deliverable.id} to project ${projectId}`)
    // Mock implementation - in real app, this would update the database
  }

  private async requestPeerReviews(projectId: string, deliverableId: string): Promise<void> {
    console.log(`🔍 Requested peer reviews for deliverable ${deliverableId} in project ${projectId}`)
    // Mock implementation - in real app, this would notify reviewers
  }

  private async updateDeliverableRating(projectId: string, review: PeerReview): Promise<void> {
    console.log(`⭐ Updated rating for project ${projectId} based on review ${review.id}`)
    // Mock implementation - in real app, this would update deliverable ratings
  }

  private async checkProjectCompletion(projectId: string): Promise<void> {
    console.log(`✅ Checking completion status for project ${projectId}`)
    // Mock implementation - in real app, this would check if all deliverables are reviewed
  }

  private async saveEndorsement(endorsement: PeerEndorsement): Promise<void> {
    console.log(`👍 Saved endorsement ${endorsement.id}`)
    // Mock implementation - in real app, this would save to database
  }

  private async notifyEndorser(endorserId: string, userId: string, skillId: string): Promise<void> {
    console.log(`📧 Notified ${endorserId} about endorsement request for ${skillId}`)
    // Mock implementation - in real app, this would send notification
  }
}

interface SkillPortfolio {
  userId: string
  skills: VerifiedSkill[]
  projects: CollaborativeProject[]
  endorsements: PeerEndorsement[]
  portfolioUrl: string
  lastUpdated: Date
}

interface VerifiedSkill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  verificationCount: number
  projectsUsed: string[]
}

interface PeerEndorsement {
  id: string
  userId: string
  skillId: string
  endorserId: string
  message: string
  strength: number
  timestamp: Date
  verified: boolean
}