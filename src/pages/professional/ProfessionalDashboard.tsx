import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, BarChart3, Users, Settings, MessageSquare } from 'lucide-react';
import { MessagingModule } from '../../components/messaging/MessagingModule';

export function ProfessionalDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plans');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (profile?.user_type !== 'professional') {
    navigate('/dashboard');
    return null;
  }

  const tabs = [
    { id: 'plans', label: 'Meus Planos', icon: BarChart3 },
    { id: 'subscribers', label: 'Assinantes', icon: Users },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-purple-50/30 to-brand-green-50/30">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-purple-600 to-brand-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-slate-800">Meus Planos</h1>
                <p className="text-sm text-slate-600">AssineSaúde Pro</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-slate-800">{profile.full_name}</p>
                <p className="text-sm text-slate-600">Profissional</p>
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

          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-brand-purple-600 to-brand-green-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'plans' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Planos de Benefícios</h2>
            <p className="text-slate-600">Sistema de criação de planos em breve.</p>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Assinantes</h2>
            <p className="text-slate-600">Lista de assinantes em breve.</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <MessagingModule />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">Configurações</h2>
            <p className="text-slate-600">Configurações do perfil em breve.</p>
          </div>
        )}
      </main>
    </div>
  );
}
