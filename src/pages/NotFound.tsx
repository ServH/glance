import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-9xl font-bold mb-4 text-text-tertiary">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-text-secondary mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button>Go Back Home</Button>
      </Link>
    </div>
  );
}
