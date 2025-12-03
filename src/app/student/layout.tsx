import { StudentSidebar } from '@/components/layout/student-sidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}
