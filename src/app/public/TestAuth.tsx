import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function TestAuth() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMagicLink = async () => {
    if (!email) {
      setStatus('❌ Entre ton email');
      return;
    }

    setLoading(true);
    setStatus('📧 Envoi du magic link par email...');
    
    try {
      const result = await authClient.signIn.magicLink({
        email,
        callbackURL: '/',
      });

      if (result.error) {
        setStatus(`❌ Erreur: ${result.error.message}`);
      } else {
        setStatus(`✅ Email envoyé à ${email}! Vérifie ta boîte mail (et les spams).`);
      }
    } catch (error: any) {
      setStatus(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>🔐 Connexion Lumora</h1>
      
      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Ton email:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
          }}
        />
      </div>

      <button
        onClick={handleSendMagicLink}
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '14px 24px',
          backgroundColor: loading ? '#ccc' : '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          width: '100%',
        }}
      >
        {loading ? '📧 Envoi...' : '📧 Recevoir le lien par email'}
      </button>

      {status && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: status.includes('❌') ? '#fee' : '#e8f5e9',
            border: `2px solid ${status.includes('❌') ? '#fcc' : '#4caf50'}`,
            borderRadius: '6px',
            fontSize: '15px',
          }}
        >
          {status}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>💡 Comment ça marche ?</h3>
        <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Entre ton email</li>
          <li>Clique sur "Recevoir le lien"</li>
          <li>Vérifie ton email (et les spams)</li>
          <li>Clique sur le lien dans l'email</li>
          <li>Tu es connecté !</li>
        </ol>
        
        <p style={{ marginTop: '20px', padding: '12px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', fontSize: '14px' }}>
          ⚠️ Si tu n'as pas de compte, il sera créé automatiquement comme <strong>client</strong>.
        </p>
      </div>
    </div>
  );
}
