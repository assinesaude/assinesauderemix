import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type UserType = 'admin' | 'professional' | 'patient';

const userTypeLabels: Record<UserType, { title: string; description: string }> = {
  admin: { title: 'Admin', description: 'Acesso administrativo' },
  professional: { title: 'Profissional', description: 'Médicos e terapeutas' },
  patient: { title: 'Paciente', description: 'Acesso para pacientes' }
};

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = (searchParams.get('type') || 'patient') as UserType;

  useEffect(() => {
    if (profile) {
      if (profile.user_type === 'admin') {
        navigate('/admin/dashboard');
      } else if (profile.user_type === 'professional') {
        navigate('/professional/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-purple-50/30 to-brand-green-50/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/">
            <img
              src="/assinesaude.png"
              alt="AssineSaúde"
              className="h-20 w-auto mx-auto mb-6"
            />
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{userTypeLabels[userType].title}</h2>
          <p className="text-slate-600">{userTypeLabels[userType].description}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-purple-600" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-purple-600" />
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-purple-600 to-brand-green-600 hover:from-brand-purple-700 hover:to-brand-green-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                'Entrando...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <Link to="/recuperar-senha" className="text-sm text-brand-purple-600 hover:text-brand-purple-700 block">
              Esqueceu sua senha?
            </Link>
            <div className="text-sm text-slate-600">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-brand-green-600 hover:text-brand-green-700 font-medium">
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
