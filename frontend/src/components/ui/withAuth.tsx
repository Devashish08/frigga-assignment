'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.replace('/login');
      } else {
        // Optional: You could add token validation logic here
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      // You can return a loading spinner here
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
  return AuthComponent;
};

export default withAuth;