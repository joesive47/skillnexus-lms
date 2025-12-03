import { careerNodes, careerEdges } from './career-data'

export interface CareerPath {
  path: string[]
  totalMonths: number
  totalDifficulty: number
  requiredSkills: string[]
  estimatedSalary: number
}

export function findCareerPath(currentCareer: string, targetCareer: string): CareerPath | null {
  const graph = buildGraph()
  const path = dijkstra(graph, currentCareer, targetCareer)
  
  if (!path) return null
  
  let totalMonths = 0
  let totalDifficulty = 0
  const requiredSkills = new Set<string>()
  
  for (let i = 0; i < path.length - 1; i++) {
    const edge = careerEdges.find(e => e.from === path[i] && e.to === path[i + 1])
    if (edge) {
      totalMonths += edge.months
      totalDifficulty += edge.difficulty
      edge.skills.forEach(s => requiredSkills.add(s))
    }
  }
  
  const targetNode = careerNodes.find(n => n.id === targetCareer)
  
  return {
    path,
    totalMonths,
    totalDifficulty,
    requiredSkills: Array.from(requiredSkills),
    estimatedSalary: targetNode?.salary || 0
  }
}

function buildGraph(): Map<string, Map<string, number>> {
  const graph = new Map<string, Map<string, number>>()
  
  careerEdges.forEach(edge => {
    if (!graph.has(edge.from)) {
      graph.set(edge.from, new Map())
    }
    graph.get(edge.from)!.set(edge.to, edge.difficulty)
  })
  
  return graph
}

function dijkstra(graph: Map<string, Map<string, number>>, start: string, end: string): string[] | null {
  const distances = new Map<string, number>()
  const previous = new Map<string, string>()
  const unvisited = new Set<string>()
  
  careerNodes.forEach(node => {
    distances.set(node.id, Infinity)
    unvisited.add(node.id)
  })
  distances.set(start, 0)
  
  while (unvisited.size > 0) {
    let current = Array.from(unvisited).reduce((min, node) => 
      (distances.get(node)! < distances.get(min)!) ? node : min
    )
    
    if (current === end) break
    if (distances.get(current) === Infinity) break
    
    unvisited.delete(current)
    
    const neighbors = graph.get(current)
    if (neighbors) {
      neighbors.forEach((weight, neighbor) => {
        if (unvisited.has(neighbor)) {
          const alt = distances.get(current)! + weight
          if (alt < distances.get(neighbor)!) {
            distances.set(neighbor, alt)
            previous.set(neighbor, current)
          }
        }
      })
    }
  }
  
  if (!previous.has(end)) return null
  
  const path: string[] = []
  let current = end
  while (current) {
    path.unshift(current)
    current = previous.get(current)!
  }
  
  return path
}