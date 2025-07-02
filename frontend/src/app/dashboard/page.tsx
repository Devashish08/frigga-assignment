// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import withAuth from '@/components/ui/withAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Document } from '@/types';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Link from 'next/link';

function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired, redirect to login
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch documents');
        }

        const data: Document[] = await response.json();
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const renderDocumentList = () => {
    if (isLoading) {
      return <p>Loading documents...</p>;
    }
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    if (documents.length === 0) {
      return <p className="text-gray-600">You have no documents yet. Click &ldquo;Create New Document&rdquo; to get started!</p>;
    }
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
           <Link key={doc.ID} href={`/documents/${doc.ID}`}>
           <Card className="hover:shadow-md transition-shadow cursor-pointer">
             <CardHeader>
               <CardTitle className="truncate">{doc.title}</CardTitle>
               <CardDescription>By {doc.author.name}</CardDescription>
             </CardHeader>
             <CardFooter className="text-sm text-gray-500">
               <p>Last updated: {format(new Date(doc.UpdatedAt), 'MMM d, yyyy')}</p>
             </CardFooter>
           </Card>
         </Link>
        ))}
      </div>
    );
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
        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearch}>
            <Input
              name="search"
              type="search"
              placeholder="Search across all documents..."
              className="w-full"
            />
          </form>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Documents</h2>
          <Button asChild>
  <Link href="/documents/new">Create New Document</Link>
</Button>
        </div>
        {renderDocumentList()}
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);