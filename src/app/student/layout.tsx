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
      {/* pt-16 = space for mobile top bar (hamburger button height ~64px) */}
      {/* lg:ml-64 = sidebar width on desktop */}
      <main className="pt-14 lg:pt-0 lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
