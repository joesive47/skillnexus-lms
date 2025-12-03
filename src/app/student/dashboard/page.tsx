import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, TrendingUp, Clock } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function StudentDashboard() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'STUDENT') {
    redirect('/login');
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true
        }
      }
    },
    take: 5
  });

  const certificates = await prisma.certificate.count({
    where: { userId: session.user.id }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Track</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <Link 
                  key={enrollment.id}
                  href={`/courses/${enrollment.course.id}`}
                  className="block p-3 hover:bg-gray-100 rounded"
                >
                  <div className="font-medium">{enrollment.course.title}</div>
                  <div className="text-sm text-muted-foreground">Continue Learning</div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No enrolled courses yet. <Link href="/courses" className="text-primary">Browse courses</Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/courses" className="block p-3 hover:bg-gray-100 rounded">
              Browse All Courses
            </Link>
            <Link href="/dashboard/certificates" className="block p-3 hover:bg-gray-100 rounded">
              View My Certificates
            </Link>
            <Link href="/learning-paths" className="block p-3 hover:bg-gray-100 rounded">
              Explore Learning Paths
            </Link>
            <Link href="/skills-assessment" className="block p-3 hover:bg-gray-100 rounded">
              Take Skills Assessment
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
