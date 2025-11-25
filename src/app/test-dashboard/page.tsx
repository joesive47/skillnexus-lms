import { auth } from "@/auth"
import prisma from '@/lib/prisma'

export default async function TestDashboard() {
  const session = await auth()
  
  if (!session?.user) {
    return <div>Not logged in</div>
  }

  let user = null
  let error = null

  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true, name: true, email: true, role: true }
    })
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session Data:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        {error && (
          <div>
            <h2 className="text-lg font-semibold text-red-600">Database Error:</h2>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {user && (
          <div>
            <h2 className="text-lg font-semibold">User Data:</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}