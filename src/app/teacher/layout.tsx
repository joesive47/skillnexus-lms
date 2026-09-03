import { TeacherSidebar } from '@/components/layout/teacher-sidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'TEACHER') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
