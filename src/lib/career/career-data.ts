// Career Graph Database - Initial Data
export const careerNodes = [
  // Technology Track
  { id: 'junior-dev', title: 'Junior Developer', level: 1, salary: 25000, category: 'tech' },
  { id: 'mid-dev', title: 'Mid-Level Developer', level: 2, salary: 45000, category: 'tech' },
  { id: 'senior-dev', title: 'Senior Developer', level: 3, salary: 70000, category: 'tech' },
  { id: 'tech-lead', title: 'Tech Lead', level: 4, salary: 100000, category: 'tech' },
  { id: 'architect', title: 'Software Architect', level: 5, salary: 150000, category: 'tech' },
  { id: 'cto', title: 'CTO', level: 6, salary: 250000, category: 'tech' },
  
  // Data Science Track
  { id: 'data-analyst', title: 'Data Analyst', level: 1, salary: 30000, category: 'data' },
  { id: 'data-scientist', title: 'Data Scientist', level: 2, salary: 60000, category: 'data' },
  { id: 'ml-engineer', title: 'ML Engineer', level: 3, salary: 80000, category: 'data' },
  { id: 'ai-architect', title: 'AI Architect', level: 4, salary: 150000, category: 'data' },
  
  // Business Track
  { id: 'marketing-coord', title: 'Marketing Coordinator', level: 1, salary: 25000, category: 'business' },
  { id: 'marketing-manager', title: 'Marketing Manager', level: 2, salary: 50000, category: 'business' },
  { id: 'digital-marketing', title: 'Digital Marketing Manager', level: 3, salary: 70000, category: 'business' },
  { id: 'cmo', title: 'CMO', level: 4, salary: 200000, category: 'business' },
]

export const careerEdges = [
  // Tech Track Progression
  { from: 'junior-dev', to: 'mid-dev', difficulty: 2, months: 12, skills: ['JavaScript', 'React', 'Node.js'] },
  { from: 'mid-dev', to: 'senior-dev', difficulty: 3, months: 24, skills: ['System Design', 'Architecture', 'Leadership'] },
  { from: 'senior-dev', to: 'tech-lead', difficulty: 4, months: 24, skills: ['Team Management', 'Project Planning', 'Mentoring'] },
  { from: 'tech-lead', to: 'architect', difficulty: 5, months: 36, skills: ['Enterprise Architecture', 'Cloud', 'Security'] },
  { from: 'architect', to: 'cto', difficulty: 5, months: 48, skills: ['Business Strategy', 'Executive Leadership', 'Vision'] },
  
  // Data Track Progression
  { from: 'data-analyst', to: 'data-scientist', difficulty: 3, months: 18, skills: ['Python', 'Statistics', 'ML Basics'] },
  { from: 'data-scientist', to: 'ml-engineer', difficulty: 4, months: 24, skills: ['Deep Learning', 'MLOps', 'Production ML'] },
  { from: 'ml-engineer', to: 'ai-architect', difficulty: 5, months: 36, skills: ['AI Strategy', 'Research', 'Innovation'] },
  
  // Cross-track transitions
  { from: 'senior-dev', to: 'ml-engineer', difficulty: 4, months: 18, skills: ['Python', 'ML', 'Data Science'] },
  { from: 'data-scientist', to: 'senior-dev', difficulty: 3, months: 12, skills: ['Software Engineering', 'APIs', 'DevOps'] },
]

export const skillTaxonomy = {
  technical: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust',
    'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express',
    'PostgreSQL', 'MongoDB', 'Redis', 'MySQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Git', 'CI/CD', 'Testing', 'Security'
  ],
  data: [
    'Python', 'R', 'SQL', 'Statistics', 'Machine Learning',
    'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch',
    'Data Visualization', 'Tableau', 'Power BI', 'Pandas', 'NumPy'
  ],
  soft: [
    'Communication', 'Leadership', 'Team Management', 'Problem Solving',
    'Critical Thinking', 'Creativity', 'Adaptability', 'Time Management',
    'Presentation', 'Negotiation', 'Conflict Resolution'
  ],
  business: [
    'Project Management', 'Agile', 'Scrum', 'Product Management',
    'Business Strategy', 'Marketing', 'Sales', 'Finance',
    'Customer Service', 'Analytics', 'ROI Analysis'
  ]
}