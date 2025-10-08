import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { app } from '@/lib/firebase';
import { AuthProvider } from '@/contexts/AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  // Verify Firebase initialization (development only)
  if (import.meta.env.DEV) {
    console.warn('Firebase initialized:', app.name);
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
