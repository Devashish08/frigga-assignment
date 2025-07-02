'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import withAuth from '@/components/ui/withAuth';
import { Document } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/documents/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
      setIsLoading(false);
    };
    fetchResults();
  }, [query]);

  if (isLoading) {
    return <p>Searching...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for &ldquo;{query}&rdquo;
      </h2>
      {results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((doc) => (
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
      ) : (
        <p>No documents found matching your search.</p>
      )}
    </div>
  );
}

function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
        </nav>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}

export default withAuth(SearchPage); 