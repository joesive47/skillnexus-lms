import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { FileManager } from '@/components/admin/file-manager'

export default async function FilesPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">File Management</h1>
        <p className="text-muted-foreground">
          Manage uploaded files with force delete capabilities for locked files
        </p>
      </div>
      
      <FileManager />
    </div>
  )
}