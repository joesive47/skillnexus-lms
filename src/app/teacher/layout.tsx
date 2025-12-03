import { TeacherSidebar } from '@/components/layout/teacher-sidebar';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}
