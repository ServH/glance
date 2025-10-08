import { useAuthContext } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuthContext();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        color: 'white',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Dashboard</h1>
      <p style={{ color: '#A1A1AA', marginBottom: '2rem' }}>
        Welcome, {user?.displayName || user?.email}!
      </p>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>User Info:</h2>
        <pre
          style={{
            fontSize: '0.875rem',
            color: '#D4D4D8',
            overflow: 'auto',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1rem',
            borderRadius: '0.5rem',
          }}
        >
          {JSON.stringify(
            {
              email: user?.email,
              displayName: user?.displayName,
              photoURL: user?.photoURL,
              uid: user?.uid,
              emailVerified: user?.emailVerified,
            },
            null,
            2
          )}
        </pre>
      </div>

      <p style={{ color: '#71717A', marginTop: '2rem', fontSize: '0.875rem' }}>
        📊 Dashboard widgets will be implemented in subsequent epics (E2, E5, E6).
      </p>
    </div>
  );
}
