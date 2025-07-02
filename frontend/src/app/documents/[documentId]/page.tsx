// frontend/src/app/documents/[documentId]/page.tsx

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import withAuth from '@/components/ui/withAuth';
import TiptapEditor from '@/components/ui/TiptapEditor';
import { SharingDialog } from '@/components/SharingDialog';
import { HistorySidebar } from '@/components/HistorySidebar';
import { Document } from '@/types';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

function DocumentEditorPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.documentId as string;
  const isNewDocument = documentId === 'new';

  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isLoading, setIsLoading] = useState(!isNewDocument);
  const [showHistory, setShowHistory] = useState(false);

  // Debounce inputs to trigger auto-save
  const [debouncedTitle] = useDebounce(title, 1000);
  const [debouncedContent] = useDebounce(content, 2000);

  // Fetch existing document data if in edit mode
  useEffect(() => {
    if (isNewDocument) {
      setSaveStatus('Unsaved');
      return;
    }

    const fetchDocument = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${documentId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setDocument(data);
          setTitle(data.title);
          setContent(data.content);
          setIsPublic(data.isPublic || false);
          setSaveStatus('Saved');
        } else {
          // Document not found or user lacks permission
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Failed to fetch document:", error);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocument();
  }, [documentId, isNewDocument, router]);

  // The core save logic, memoized with useCallback
  const saveDocument = useCallback(async () => {
    setSaveStatus('Saving...');
    const token = localStorage.getItem('authToken');
    
    // This payload will now use the LATEST state for all three variables
    const payload = { title, content, isPublic };

    const currentDocId = isNewDocument ? null : document?.ID;
    const url = currentDocId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${currentDocId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/documents`;
    
    const method = currentDocId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedDoc = await response.json();
        setDocument(savedDoc);
        setSaveStatus('Saved');
        if (isNewDocument) {
          // If a new document was just created, redirect to its new edit URL
          router.replace(`/documents/${savedDoc.ID}`);
        }
      } else {
        setSaveStatus('Error saving');
      }
    } catch (error) {
      console.error("Save operation failed:", error);
      setSaveStatus('Error saving');
    }
  }, [isNewDocument, document?.ID, router, title, content, isPublic]);

  // The auto-save trigger effect
  useEffect(() => {
    // Determine if there are changes to be saved
    const hasChanges = debouncedTitle !== document?.title || debouncedContent !== document?.content || isPublic !== document?.isPublic;

    if (hasChanges) {
      // Don't save if it's a new doc and completely empty
      if (isNewDocument && !debouncedTitle && !debouncedContent) {
        return;
      }
      saveDocument();
    }
  }, [debouncedTitle, debouncedContent, isPublic, document, isNewDocument, saveDocument]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading document...</p>
      </div>
    );
  }

  return (
    <div className={`flex ${showHistory ? 'h-screen' : ''}`}>
      {/* Main Editor Content */}
      <div className={`container mx-auto p-4 ${showHistory ? 'w-2/3' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-4">
    {/* --- Left Side --- */}
    <Button asChild variant="outline">
      <Link href="/dashboard">Back to Dashboard</Link>
    </Button>

    {/* --- Right Side (Grouped) --- */}
    <div className="flex items-center space-x-4">
      {/* History Button (only for existing docs) */}
      {!isNewDocument && document && (
        <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Close History' : 'History'}
        </Button>
      )}

      {/* Share Button (only for existing docs) */}
      {!isNewDocument && document && (
        <SharingDialog documentId={document.ID} />
      )}

      {/* Public Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="public-switch"
          checked={isPublic}
          onCheckedChange={(checked) => {
            setIsPublic(checked);
            setSaveStatus('Unsaved changes');
          }}
        />
        <Label htmlFor="public-switch">Public</Label>
      </div>

      {/* Save Status */}
      <span className="text-sm text-gray-500 w-24 text-right">{saveStatus}</span>
    </div>
</div>

      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setSaveStatus('Unsaved changes');
        }}
        placeholder="Document Title..."
        className="text-4xl font-bold w-full focus:outline-none mb-4 bg-transparent"
      />
        <TiptapEditor 
          content={content} 
          onChange={(newContent) => {
            setContent(newContent);
            setSaveStatus('Unsaved changes');
          }} 
        />
      </div>

      {/* History Sidebar */}
      {showHistory && document && (
        <div className="w-1/3 border-l bg-gray-50">
          <HistorySidebar documentId={document.ID} currentContent={content} />
        </div>
      )}
    </div>
  );
}

export default withAuth(DocumentEditorPage);