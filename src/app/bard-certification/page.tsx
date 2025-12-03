import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { BardCertificateTemplate } from '@/components/certificates/bard-certificate-template';
import { PrintButton } from '@/components/print-button';

export default async function BardCertificationPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  // Example data - replace with actual user data
  const certificationKeys = [
    { name: 'Python Programming', score: 95, hours: 40, duration: '4 weeks' },
    { name: 'Data Analytics', score: 92, hours: 35, duration: '3 weeks' },
    { name: 'Data Cleansing', score: 88, hours: 25, duration: '2 weeks' },
    { name: 'Data Visualization', score: 94, hours: 30, duration: '3 weeks' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">BARD Certification System</h1>
          <p className="text-gray-600">Your Master Certification</p>
        </div>

        <div className="bg-white shadow-2xl mx-auto" style={{ width: '210mm' }}>
          <BardCertificateTemplate
            recipientName={session.user.name || 'Student Name'}
            pathName="Data Analytics Path"
            certificationKeys={certificationKeys}
            issueDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            certificateId={`BARD-DATA-${new Date().getFullYear()}-${Math.random().toString().slice(2, 8)}`}
          />
        </div>

        <div className="text-center mt-6">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
