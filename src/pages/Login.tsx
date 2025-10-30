import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
    // Auth will be implemented next
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Welcome to Mycelium</h1>
        <p className="text-muted-foreground mb-6">Login to start your coding journey</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
        </p>
      </Card>
    </div>
  );
}
