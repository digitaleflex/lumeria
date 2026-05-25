import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';

export function MagicLinkCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setError('Token manquant');
        return;
      }

      try {
        // Better Auth gère automatiquement la vérification
        setStatus('success');
        
        // Rediriger après 1 seconde
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Erreur de connexion');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h2>Connexion en cours...</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>Veuillez patienter</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h2>Connexion réussie !</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>Redirection...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h2>Erreur de connexion</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>{error}</p>
            <button
              onClick={() => navigate('/test-auth')}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
