import { StudentSidebar } from '@/components/layout/student-sidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'STUDENT') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
