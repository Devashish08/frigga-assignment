'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User } from '@/types';
import { useDebounce } from 'use-debounce';

interface SharingDialogProps {
  documentId: number;
}

export function SharingDialog({ documentId }: SharingDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Effect to search for users
  useEffect(() => {
    if (debouncedSearchQuery) {
      const search = async () => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/search?q=${debouncedSearchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setSearchResults(data);
      };
      search();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const handleShare = async (email: string) => {
    const token = localStorage.getItem('authToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${documentId}/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, level: 'VIEW' }), // Default to VIEW for now
    });
    setSearchQuery('');
    // Here you would ideally refresh the list of shared users
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Enter an email to share this document with others.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <Input
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="mt-2 space-y-1">
            {searchResults.map((user) => (
              <div key={user.ID} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Button size="sm" onClick={() => handleShare(user.email)}>
                  Share
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 