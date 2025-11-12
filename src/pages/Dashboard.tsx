import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';
import { MessagingModule } from '../components/messaging/MessagingModule';

export function Dashboard() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'messages'>('overview');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (!loading && profile) {
      if (profile.user_type === 'admin') {
        navigate('/admin');
      } else if (profile.user_type === 'professional') {
        navigate('/professional');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-brand-purple-50/30 to-brand-green-50/30">
        <div className="text-lg text-slate-600">Carregando...</div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-purple-50/30 to-brand-green-50/30">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="w-8 h-8 text-brand-purple-600" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-slate-800">AssineSaúde</h1>
              <p className="text-sm text-slate-600">Painel de Controle</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-slate-800">{profile.full_name}</p>
              <p className="text-sm text-slate-600 capitalize">{profile.user_type}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <div className="flex gap-4 border-b border-slate-200 bg-white rounded-t-xl px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-brand-purple-600 border-b-2 border-brand-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'text-brand-purple-600 border-b-2 border-brand-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Mensagens
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
          <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">
            Bem-vindo ao AssineSaúde
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Seu dashboard está sendo preparado. Em breve você terá acesso a todas as funcionalidades.
          </p>

          {profile.user_type === 'professional' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-purple-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-purple-600">Meus Planos</h3>
                <p className="text-sm text-slate-600">Gerencie seus planos de benefícios</p>
              </div>
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-green-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-green-600">Pacientes</h3>
                <p className="text-sm text-slate-600">Visualize e gerencie seus pacientes</p>
              </div>
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-purple-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-purple-600">Agenda</h3>
                <p className="text-sm text-slate-600">Gerencie seus agendamentos</p>
              </div>
            </div>
          )}

          {profile.user_type === 'patient' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-purple-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-purple-600">Minhas Assinaturas</h3>
                <p className="text-sm text-slate-600">Veja seus planos ativos</p>
              </div>
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-green-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-green-600">Prontuário</h3>
                <p className="text-sm text-slate-600">Acesse seu histórico médico</p>
              </div>
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-purple-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-purple-600">Agendamentos</h3>
                <p className="text-sm text-slate-600">Marque suas consultas</p>
              </div>
            </div>
          )}

          {profile.user_type === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-purple-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-purple-600">Gerenciar Profissionais</h3>
                <p className="text-sm text-slate-600">Aprovar e gerenciar cadastros</p>
              </div>
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-green-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-green-600">Conteúdo do Site</h3>
                <p className="text-sm text-slate-600">Gerenciar carrossel e depoimentos</p>
              </div>
              <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-brand-purple-500 transition-all cursor-pointer group">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-purple-600">Relatórios</h3>
                <p className="text-sm text-slate-600">Visualizar estatísticas</p>
              </div>
            </div>
          )}
        </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <MessagingModule />
          </div>
        )}
      </main>
    </div>
  );
}
