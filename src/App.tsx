import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { app } from '@/lib/firebase';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  // Verify Firebase initialization (development only)
  if (import.meta.env.DEV) {
    console.warn('Firebase initialized:', app.name);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
