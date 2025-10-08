import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-text-secondary mb-8">Protected route - Coming soon</p>
      <Link to="/">
        <Button variant="outline">Back to Landing</Button>
      </Link>
    </div>
  );
}
