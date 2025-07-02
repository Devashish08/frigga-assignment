// frontend/src/components/HistorySidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { Version } from '@/types';
import { format } from 'date-fns';

interface HistorySidebarProps {
  documentId: number;
  currentContent: string;
}

export function HistorySidebar({ documentId, currentContent }: HistorySidebarProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${documentId}/versions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      }
    };
    fetchHistory();
  }, [documentId]);

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h3 className="font-bold mb-4">Version History</h3>
        <ul>
          {versions.map((version) => (
            <li key={version.ID} className="mb-2">
              <button
                onClick={() => setSelectedVersion(version)}
                className={`w-full text-left p-2 rounded-md hover:bg-gray-100 ${
                  selectedVersion?.ID === version.ID ? 'bg-blue-100 border border-blue-300' : ''
                }`}
              >
                <p className="font-medium">{format(new Date(version.CreatedAt), 'MMM d, yyyy, h:mm a')}</p>
                <p className="text-sm text-gray-600">by {version.author.name}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 p-4 overflow-y-auto">
        <h3 className="font-bold mb-4">Changes</h3>
        {selectedVersion ? (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="flex flex-col">
              <h4 className="font-medium mb-2 text-sm text-gray-700 border-b pb-2">
                Version from {format(new Date(selectedVersion.CreatedAt), 'h:mm a')}
              </h4>
              <div className="flex-1 bg-red-50 border border-red-200 rounded p-3 overflow-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {selectedVersion.content || 'No content'}
                </pre>
              </div>
            </div>
            <div className="flex flex-col">
              <h4 className="font-medium mb-2 text-sm text-gray-700 border-b pb-2">
                Current Version
              </h4>
              <div className="flex-1 bg-green-50 border border-green-200 rounded p-3 overflow-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {currentContent || 'No content'}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-8">Select a version to see the changes.</p>
        )}
      </div>
    </div>
  );
}