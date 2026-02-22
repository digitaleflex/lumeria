/* ============================================
   LOGIN PAGE - Magic Link Authentication
   Pas de mot de passe, juste un email !
   ============================================ */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Send, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Countdown timer component
function CountdownTimer({ seconds, onComplete }: { seconds: number; onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-xl">
      <Clock className="w-5 h-5" />
      <span className="font-medium">
        {formatTime(timeLeft)}
      </span>
      <span className="text-amber-600/70">avant un nouveau lien</span>
    </div>
  );
}

export function Login() {
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthContext();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  // Check for stored cooldown on mount
  useEffect(() => {
    const storedCooldownEnd = localStorage.getItem('magic_link_cooldown');
    if (storedCooldownEnd) {
      const endTime = parseInt(storedCooldownEnd);
      const now = Date.now();
      if (endTime > now) {
        setCooldown(Math.ceil((endTime - now) / 1000));
      } else {
        localStorage.removeItem('magic_link_cooldown');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login(email);
    if (success) {
      setEmailSent(true);
      // Set cooldown (60 seconds)
      const cooldownEnd = Date.now() + 60 * 1000;
      localStorage.setItem('magic_link_cooldown', cooldownEnd.toString());
      setCooldown(60);
      setRemainingAttempts((prev) => Math.max(0, prev - 1));
    }
  };

  const handleCooldownComplete = useCallback(() => {
    setCooldown(0);
    localStorage.removeItem('magic_link_cooldown');
  }, []);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;
    clearError();

    const success = await login(email);
    if (success) {
      setEmailSent(true);
      const cooldownEnd = Date.now() + 60 * 1000;
      localStorage.setItem('magic_link_cooldown', cooldownEnd.toString());
      setCooldown(60);
      setRemainingAttempts((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
            LUMORA
          </Link>
          <p className="text-gray-500 mt-2">
            {emailSent ? 'Vérifiez votre boîte mail !' : t('auth.login_title')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Success State - Email Sent */}
          {emailSent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lien de connexion envoyé !
              </h3>
              <p className="text-gray-500 mb-6">
                Un email avec un lien magique a été envoyé à<br />
                <span className="font-medium text-gray-700">{email}</span>
              </p>

              <div className="space-y-4">
                {cooldown > 0 ? (
                  <div className="flex justify-center">
                    <CountdownTimer
                      seconds={cooldown}
                      onComplete={handleCooldownComplete}
                    />
                  </div>
                ) : (
                  <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full"
                    disabled={remainingAttempts <= 0}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Renvoyer le lien
                  </Button>
                )}

                <p className="text-sm text-gray-400">
                  {remainingAttempts} tentative{remainingAttempts !== 1 ? 's' : ''} restante{remainingAttempts !== 1 ? 's' : ''} cette heure
                </p>

                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                >
                  Utiliser un autre email
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Google Login */}
              <div className="mb-6">
                <Button
                  onClick={async () => {
                    await loginWithGoogle();
                  }}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 py-6 hover:bg-gray-50 bg-white"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  <span className="text-gray-700 font-medium">Continuer avec Google</span>
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.or_continue_with')}</span>
                </div>
              </div>

              {/* Magic Link Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Nous vous enverrons un lien magique pour vous connecter sans mot de passe.
                </p>

                <Button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700 py-3.5 text-base font-medium"
                  disabled={isLoading || cooldown > 0}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : cooldown > 0 ? (
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Patientez {Math.ceil(cooldown / 60)} min
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Recevoir le lien de connexion
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">{t('auth.no_account')} </span>
                <span className="text-violet-600 font-medium">
                  Un compte sera créé automatiquement
                </span>
              </div>
            </>
          )}
        </div>

        {/* Info Box */}
        {!emailSent && (
          <div className="mt-6 p-4 bg-violet-50 rounded-xl text-center text-sm">
            <p className="font-medium text-violet-700 mb-1">🔐 Connexion sécurisée</p>
            <p className="text-violet-600">Pas de mot de passe à retenir, juste votre email !</p>
          </div>
        )}
      </div>
    </div>
  );
}
