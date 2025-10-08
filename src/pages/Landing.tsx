import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-accent-from to-accent-to bg-clip-text text-transparent">
        Glance
      </h1>
      <p className="text-xl text-text-secondary mb-8">Your intelligent email companion</p>
      <Link to="/login">
        <Button size="lg">Get Started</Button>
      </Link>
    </div>
  );
}
