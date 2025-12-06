import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Package, FileText, Upload, Users, BarChart3 } from 'lucide-react'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ScormDashboard() {
  // Get SCORM statistics
  const [
    totalPackages,
    totalLessons,
    packagesWithContent,
    totalProgress
  ] = await Promise.all([
    prisma.scormPackage.count(),
    prisma.lesson.count({ where: { lessonType: 'SCORM' } }),
    prisma.scormPackage.count({ where: { manifest: { not: null } } }),
    prisma.scormProgress.count()
  ])

  const recentPackages = await prisma.scormPackage.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      lesson: {
        include: {
          course: true
        }
      }
    }
  })

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">SCORM Management Dashboard</h1>
        <Badge variant="outline">System Overview</Badge>
      </div>

      <div className="space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{totalPackages}</div>
                  <div className="text-sm text-gray-600">Total Packages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalLessons}</div>
                  <div className="text-sm text-gray-600">SCORM Lessons</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Upload className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">{packagesWithContent}</div>
                  <div className="text-sm text-gray-600">Ready Packages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{totalProgress}</div>
                  <div className="text-sm text-gray-600">User Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent SCORM Packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Recent SCORM Packages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPackages.length > 0 ? (
              <div className="space-y-3">
                {recentPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{pkg.title || 'Untitled Package'}</p>
                        <p className="text-sm text-gray-600">
                          {pkg.lesson.course.title} • {pkg.lesson.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">v{pkg.version}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(pkg.createdAt).toLocaleDateString()}
                      </span>
                      <Link href={`/dashboard/admin/courses/${pkg.lesson.courseId}/scorm`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No SCORM packages found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/admin/courses/new">
                <Button className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Create SCORM Course
                </Button>
              </Link>
              <Link href="/dashboard/admin/courses">
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Courses
                </Button>
              </Link>
              <Link href="/scorm-demo">
                <Button className="w-full" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Test SCORM Player
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}