import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Award, BookOpen, Brain, Route, Search, Users } from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type AdminDashboardProps = {
  searchParams: Promise<{
    learner?: string;
    path?: string;
    skill?: string;
    certificate?: string;
    attention?: string;
  }>;
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const requestedFilters = await searchParams;
  const learner = requestedFilters.learner?.trim().slice(0, 100) ?? '';
  const pathId = requestedFilters.path?.trim() ?? '';
  const skillId = requestedFilters.skill?.trim() ?? '';
  const certificateFilter = ['earned', 'missing'].includes(requestedFilters.certificate ?? '')
    ? requestedFilters.certificate!
    : 'all';
  const attentionFilter = ['needs-attention', 'on-track'].includes(requestedFilters.attention ?? '')
    ? requestedFilters.attention!
    : 'all';

  const learnerWhere: Prisma.UserWhereInput = {
    role: 'STUDENT',
    ...(learner ? {
      OR: [
        { name: { contains: learner, mode: 'insensitive' as const } },
        { email: { contains: learner, mode: 'insensitive' as const } },
      ],
    } : {}),
    ...(pathId ? { pathEnrollments: { some: { pathId } } } : {}),
    ...(skillId ? { skillAssessments: { some: { skillId } } } : {}),
    ...(certificateFilter === 'earned' ? { certificates: { some: { status: 'ACTIVE' } } } : {}),
    ...(certificateFilter === 'missing' ? { certificates: { none: { status: 'ACTIVE' } } } : {}),
  };

  const [totalLearners, totalCourses, totalCertificates, learningPaths, skills, rawLearners] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.course.count(),
    prisma.certificate.count({ where: { status: 'ACTIVE' } }),
    prisma.learningPath.findMany({ where: { isActive: true }, select: { id: true, title: true }, orderBy: { title: 'asc' } }),
    prisma.skill.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.user.findMany({
      where: learnerWhere,
      select: {
        id: true,
        name: true,
        email: true,
        enrollments: { select: { id: true } },
        progressSummaries: { select: { progressPercent: true, lastActivity: true } },
        certificates: { where: { status: 'ACTIVE' }, select: { id: true, issuedAt: true } },
        pathEnrollments: {
          select: { progress: true, lastAccessAt: true, path: { select: { id: true, title: true } } },
          orderBy: { lastAccessAt: 'desc' },
        },
        skillAssessments: {
          select: { level: true, skill: { select: { id: true, name: true } } },
          orderBy: { level: 'desc' },
        },
        courseTrackingEvents: {
          where: { event: 'VIDEO_PRESENCE_VIOLATION' },
          select: { id: true, occurredAt: true, metadata: true },
          orderBy: { occurredAt: 'desc' },
          take: 20,
        },
      },
      orderBy: [{ name: 'asc' }, { email: 'asc' }],
      take: 100,
    }),
  ]);

  const staleBoundary = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const learnerRows = rawLearners.map((student) => {
    const averageProgress = student.progressSummaries.length
      ? clampPercent(student.progressSummaries.reduce((sum, item) => sum + item.progressPercent, 0) / student.progressSummaries.length)
      : 0;
    const latestActivity = student.progressSummaries.reduce<Date | null>((latest, item) => (
      !latest || item.lastActivity > latest ? item.lastActivity : latest
    ), null);
    const needsAttention = student.enrollments.length > 0
      && averageProgress < 100
      && (!latestActivity || latestActivity < staleBoundary);
    return { ...student, averageProgress, latestActivity, needsAttention };
  }).filter((student) => (
    attentionFilter === 'needs-attention' ? student.needsAttention
      : attentionFilter === 'on-track' ? !student.needsAttention
        : true
  ));

  const needsAttentionCount = learnerRows.filter((student) => student.needsAttention).length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLearners}</div>
            <p className="text-xs text-muted-foreground">registered learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
            <p className="text-xs text-muted-foreground">active credentials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learner Care</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsAttentionCount}</div>
            <p className="text-xs text-muted-foreground">need follow-up in this view</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Learner Care Report</CardTitle>
          <p className="text-sm text-muted-foreground">Filter learners across course progress, certifications, learning paths, and verified skill sets. “Needs attention” means an unfinished enrollment with no recorded activity for 14 days.</p>
        </CardHeader>
        <CardContent>
          <form className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-6" action="/admin/dashboard" method="get">
            <label className="xl:col-span-2">
              <span className="sr-only">Learner name or email</span>
              <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input name="learner" defaultValue={learner} placeholder="Name or email" className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm" /></div>
            </label>
            <select name="path" defaultValue={pathId} aria-label="Learning path" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="">All learning paths</option>
              {learningPaths.map((path) => <option key={path.id} value={path.id}>{path.title}</option>)}
            </select>
            <select name="skill" defaultValue={skillId} aria-label="Skill" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="">All skills</option>
              {skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
            </select>
            <select name="certificate" defaultValue={certificateFilter} aria-label="Certification status" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="all">All credentials</option><option value="earned">Certificate earned</option><option value="missing">No active certificate</option>
            </select>
            <select name="attention" defaultValue={attentionFilter} aria-label="Learner care status" className="h-10 rounded-md border bg-background px-3 text-sm">
              <option value="all">All care statuses</option><option value="needs-attention">Needs attention</option><option value="on-track">On track</option>
            </select>
            <div className="flex gap-2 xl:col-span-6">
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Apply filters</button>
              <Link href="/admin/dashboard" className="rounded-md border px-4 py-2 text-sm font-medium">Clear</Link>
            </div>
          </form>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Learner</th><th className="px-4 py-3">Care status</th><th className="px-4 py-3">Courses</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Learning paths</th><th className="px-4 py-3">Skill set</th><th className="px-4 py-3">Certificates</th><th className="px-4 py-3">Video alerts</th></tr></thead>
              <tbody className="divide-y">
                {learnerRows.map((student) => (
                  <tr key={student.id} className="align-top hover:bg-muted/30">
                    <td className="px-4 py-3"><p className="font-medium">{student.name || 'Unnamed learner'}</p><p className="text-xs text-muted-foreground">{student.email}</p></td>
                    <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${student.needsAttention ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{student.needsAttention ? 'Needs attention' : 'On track'}</span>{student.latestActivity && <p className="mt-1 text-xs text-muted-foreground">Last {student.latestActivity.toLocaleDateString('en-GB')}</p>}</td>
                    <td className="px-4 py-3 font-medium">{student.enrollments.length}</td>
                    <td className="px-4 py-3"><div className="mb-1 flex justify-between"><span>{student.averageProgress}%</span></div><Progress value={student.averageProgress} className="h-2 w-28" /></td>
                    <td className="px-4 py-3">{student.pathEnrollments.length ? student.pathEnrollments.slice(0, 2).map((entry) => <p key={entry.path.id} className="mb-1"><Route className="mr-1 inline h-3 w-3" />{entry.path.title} ({clampPercent(entry.progress)}%)</p>) : <span className="text-muted-foreground">None</span>}</td>
                    <td className="px-4 py-3">{student.skillAssessments.length ? student.skillAssessments.slice(0, 3).map((entry) => <span key={entry.skill.id} className="mb-1 mr-1 inline-flex rounded bg-muted px-2 py-1 text-xs"><Brain className="mr-1 h-3 w-3" />{entry.skill.name} {clampPercent(entry.level)}%</span>) : <span className="text-muted-foreground">Not assessed</span>}</td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1 font-medium"><Award className="h-4 w-4" />{student.certificates.length}</span></td>
                    <td className="px-4 py-3"><span className={`font-medium ${student.courseTrackingEvents.length ? 'text-amber-700' : 'text-emerald-700'}`}>{student.courseTrackingEvents.length}</span>{student.courseTrackingEvents[0] && <p className="mt-1 text-xs text-muted-foreground">Last {student.courseTrackingEvents[0].occurredAt.toLocaleDateString('en-GB')}</p>}</td>
                  </tr>
                ))}
                {!learnerRows.length && <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No learners match the selected filters.</td></tr>}
              </tbody>
            </table>
          </div>
          {rawLearners.length === 100 && <p className="mt-3 text-xs text-muted-foreground">Showing up to 100 matching learners. Refine the filters to narrow the report.</p>}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/users" className="block p-2 hover:bg-gray-100 rounded text-sm">
              👥 Manage Users
            </Link>
            <Link href="/dashboard/admin/credits" className="block p-2 hover:bg-gray-100 rounded text-sm">
              💰 Manage Credits
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/courses" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📚 Manage Courses
            </Link>
            <Link href="/dashboard/admin/courses/new" className="block p-2 hover:bg-gray-100 rounded text-sm">
              ➕ Create Course
            </Link>
            <Link href="/dashboard/admin/course-categories" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🗂️ Course Categories
            </Link>
            <Link href="/dashboard/admin/quizzes" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📝 Manage Quizzes
            </Link>
            <Link href="/dashboard/admin/scorm" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📦 SCORM Packages
            </Link>
            <Link href="/dashboard/admin/interactive" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🎮 Interactive Content
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificates & Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/certifications" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🏆 Certification System
            </Link>
            <Link href="/dashboard/admin/certificates" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📜 Legacy Certificates
            </Link>
            <Link href="/dashboard/admin/bard-certificates" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🎖️ BARD Certificates
            </Link>
            <Link href="/dashboard/admin/badges" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🥇 Legacy Badges
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI & Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/chatbot" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🤖 Chatbot Management
            </Link>
            <Link href="/dashboard/rag-management" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📄 RAG Documents
            </Link>
            <Link href="/ai-learning" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🧠 AI Learning
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/skills-assessment" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📊 Skills Assessment
            </Link>
            <Link href="/dashboard/admin/voice-assignments" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🎤 Voice Assignments
            </Link>
            <Link href="/dashboard/admin/skills-assessment" className="block p-2 hover:bg-gray-100 rounded text-sm">
              ⚙️ Manage Assessments
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments & Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/payments" className="block p-2 hover:bg-gray-100 rounded text-sm">
              💳 Payments
            </Link>
            <Link href="/dashboard/admin/files" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📁 File Manager
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enterprise Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/enterprise/dashboard" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🏢 Enterprise Dashboard
            </Link>
            <Link href="/enterprise/tenant-management" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🏛️ Tenant Management
            </Link>
            <Link href="/enterprise/audit-logs" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📋 Audit Logs
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics & Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/analytics" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📈 Analytics
            </Link>
            <Link href="/admin/course-analytics" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📊 Course Analytics
            </Link>
            <Link href="/performance" className="block p-2 hover:bg-gray-100 rounded text-sm">
              ⚡ Performance
            </Link>
            <Link href="/system-status" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🔧 System Status
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/live-sessions" className="block p-2 hover:bg-gray-100 rounded text-sm">
              📹 Live Sessions
            </Link>
            <Link href="/dashboard/classrooms" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🏫 Classrooms
            </Link>
            <Link href="/learning-paths" className="block p-2 hover:bg-gray-100 rounded text-sm">
              🛤️ Learning Paths
            </Link>
            <Link href="/social-learning" className="block p-2 hover:bg-gray-100 rounded text-sm">
              👥 Social Learning
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
