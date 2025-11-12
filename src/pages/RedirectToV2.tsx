import { useEffect } from 'react';

const RedirectToV2 = () => {
  useEffect(() => {
    window.location.href = 'https://myceliumteam2.lovable.app/register';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to Version 1.1...</p>
      </div>
    </div>
  );
};

export default RedirectToV2;
