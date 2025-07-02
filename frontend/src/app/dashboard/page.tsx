// frontend/src/app/dashboard/page.tsx
'use client';

import withAuth from '@/components/ui/withAuth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-gray-800">Knowledge Base</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </nav>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Documents</h2>
          <Button>Create New Document</Button>
        </div>
        
        {/* We will render the document list here in the next step */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">You have no documents yet.</p>
        </div>
      </main>
    </div>
  );
}

// Wrap the component with the HOC to protect it
export default withAuth(DashboardPage);