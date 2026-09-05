import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, Brain, Clock, Route, TrendingUp } from 'lucide-react';
import prisma from '@/lib/prisma';
import { LogoutButton } from '@/components/auth/logout-button';

export const dynamic = 'force-dynamic';

const clampPercent = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

const formatStudyTime = (seconds: number) => {
  if (seconds < 60) return `${Math.round(seconds)} sec`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  return `${(seconds / 3600).toFixed(1)} hr`;
};

const skillLevelLabel = (level: number) => {
  if (level >= 80) return 'Advanced';
  if (level >= 50) return 'Proficient';
  if (level > 0) return 'Developing';
  return 'Not assessed';
};

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'STUDENT') redirect('/login');

  const userId = session.user.id;
  const [enrollments, certificates, pathEnrollments, skillAssessments, studyTime] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            progressSummaries: {
              where: { userId },
              select: { progressPercent: true, lastActivity: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.certificate.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { course: { select: { title: true } } },
      orderBy: { issuedAt: 'desc' },
    }),
    prisma.learningPathEnrollment.findMany({
      where: { userId },
      include: {
        path: {
          include: {
            steps: {
              orderBy: { order: 'asc' },
              include: { completions: { where: { userId }, select: { id: true } } },
            },
          },
        },
      },
      orderBy: { lastAccessAt: 'desc' },
    }),
    prisma.skillAssessment.findMany({
      where: { userId },
      include: { skill: { select: { name: true } } },
      orderBy: { level: 'desc' },
    }),
    prisma.watchHistory.aggregate({ where: { userId }, _sum: { watchTime: true } }),
  ]);

  const courseProgress = enrollments.map((enrollment) => ({
    ...enrollment,
    progress: clampPercent(enrollment.course.progressSummaries[0]?.progressPercent ?? 0),
  }));
  const averageProgress = courseProgress.length
    ? Math.round(courseProgress.reduce((sum, enrollment) => sum + enrollment.progress, 0) / courseProgress.length)
    : 0;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Student Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your learning progress, credentials, paths, and skill set in one place.</p>
        </div>
        <div className="self-start sm:self-auto"><LogoutButton /></div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">My Courses</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{enrollments.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Certificates Earned</CardTitle><Award className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{certificates.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Overall Progress</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="mb-2 text-2xl font-bold">{averageProgress}%</div><Progress value={averageProgress} className="h-2" aria-label={`Overall progress ${averageProgress}%`} /></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Study Time</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatStudyTime(studyTime._sum.watchTime ?? 0)}</div></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> My Courses</CardTitle><Link href="/student/courses" className="text-sm text-primary hover:underline">View all</Link></CardHeader>
          <CardContent className="space-y-4">
            {courseProgress.length ? courseProgress.slice(0, 5).map((enrollment) => (
              <Link key={enrollment.id} href={`/courses/${enrollment.course.id}`} className="block rounded-lg border p-3 hover:bg-muted/50">
                <div className="mb-2 flex items-center justify-between gap-3"><span className="font-medium">{enrollment.course.title}</span><span className="text-sm font-medium">{enrollment.progress}%</span></div>
                <Progress value={enrollment.progress} className="h-2" />
              </Link>
            )) : <p className="text-sm text-muted-foreground">No enrolled courses yet. <Link href="/courses" className="text-primary hover:underline">Browse courses</Link></p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Certifications</CardTitle><Link href="/dashboard/certificates" className="text-sm text-primary hover:underline">View all</Link></CardHeader>
          <CardContent className="space-y-3">
            {certificates.length ? certificates.slice(0, 4).map((certificate) => (
              <div key={certificate.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="min-w-0"><p className="truncate font-medium">{certificate.course.title}</p><p className="text-xs text-muted-foreground">Issued {certificate.issuedAt.toLocaleDateString('en-GB')} · {certificate.certificateNumber}</p></div>
                <Link href={`/api/certificates/download/${certificate.certificateNumber}`} className="shrink-0 text-sm text-primary hover:underline">Download</Link>
              </div>
            )) : <p className="text-sm text-muted-foreground">Complete an eligible course to earn your first certificate.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Route className="h-5 w-5" /> Learning Paths</CardTitle><Link href="/learning-paths" className="text-sm text-primary hover:underline">Explore paths</Link></CardHeader>
          <CardContent className="space-y-4">
            {pathEnrollments.length ? pathEnrollments.slice(0, 4).map((enrollment) => {
              const completedSteps = enrollment.path.steps.filter((step) => step.completions.length > 0).length;
              const progress = enrollment.path.steps.length ? clampPercent((completedSteps / enrollment.path.steps.length) * 100) : clampPercent(enrollment.progress);
              const nextStep = enrollment.path.steps.find((step) => step.completions.length === 0);
              return <div key={enrollment.id} className="rounded-lg border p-3"><div className="mb-2 flex items-center justify-between gap-3"><span className="font-medium">{enrollment.path.title}</span><span className="text-sm">{progress}%</span></div><Progress value={progress} className="mb-2 h-2" /><p className="text-xs text-muted-foreground">{nextStep ? `Next: ${nextStep.title}` : 'Path completed'} · {completedSteps}/{enrollment.path.steps.length} steps</p></div>;
            }) : <p className="text-sm text-muted-foreground">You have not joined a learning path yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> My Skill Set</CardTitle><Link href="/skills-assessment" className="text-sm text-primary hover:underline">Assess skills</Link></CardHeader>
          <CardContent className="space-y-4">
            {skillAssessments.length ? skillAssessments.slice(0, 6).map((assessment) => {
              const level = clampPercent(assessment.level);
              return <div key={assessment.id}><div className="mb-1 flex items-center justify-between gap-3"><span className="text-sm font-medium">{assessment.skill.name}</span><span className="text-xs text-muted-foreground">{skillLevelLabel(level)} · {level}%</span></div><Progress value={level} className="h-2" /></div>;
            }) : <p className="text-sm text-muted-foreground">Take a skills assessment to build your verified skill set and receive learning recommendations.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
