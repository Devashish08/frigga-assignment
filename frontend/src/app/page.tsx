// frontend/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL is not defined");
        }

        const response = await fetch(`${apiUrl}/api/health`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBackendStatus(data.status);
        setBackendMessage(data.message);
      } catch (error) {
        console.error("Failed to fetch backend status:", error);
        setBackendStatus('error');
        setBackendMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    checkBackendHealth();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Frigga Cloud Labs Assignment</h1>
        <p className="text-lg text-gray-300">Knowledge Base Platform</p>
        <div className="mt-8 p-6 rounded-lg bg-gray-800 border border-gray-700">
          <h2 className="text-2xl font-semibold">Backend Connection Test</h2>
          <p className="mt-2">
            Status: 
            <span className={`ml-2 font-bold ${backendStatus === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
              {backendStatus.toUpperCase()}
            </span>
          </p>
          {backendMessage && <p className="mt-1 text-sm text-gray-400">{backendMessage}</p>}
        </div>
      </div>
    </main>
  );
}