import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function RecentCandidates() {
  const candidates = [
    {
      name: "Alex Johnson",
      position: "Senior Frontend Developer",
      match: 92,
      skills: ["React", "TypeScript", "UI/UX"],
    },
    {
      name: "Sarah Williams",
      position: "DevOps Engineer",
      match: 88,
      skills: ["Kubernetes", "AWS", "CI/CD"],
    },
    {
      name: "Michael Chen",
      position: "Product Manager",
      match: 85,
      skills: ["Agile", "Strategy", "Analytics"],
    },
    {
      name: "Emily Rodriguez",
      position: "Data Scientist",
      match: 82,
      skills: ["Python", "ML", "Statistics"],
    },
  ]

  return (
    <div className="space-y-4">
      {candidates.map((candidate, index) => (
        <div key={index} className="flex flex-col space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{candidate.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.position}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">{candidate.match}%</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Match</p>
            </div>
          </div>
          <Progress value={candidate.match} className="h-1.5" />
          <div className="flex flex-wrap gap-1">
            {candidate.skills.map((skill, skillIndex) => (
              <Badge key={skillIndex} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

