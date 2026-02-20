import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface Subscriber {
  id: string;
  user_id: string;
  plan_id: string | null;
  status: string;
  started_at: string;
  expires_at: string | null;
}

export function SubscribersList() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscribers();
    }
  }, [user]);

  const fetchSubscribers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('started_at', { ascending: false });

      if (!error && data) {
        setSubscribers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800',
    };
    const labels: Record<string, string> = {
      active: 'Ativo',
      cancelled: 'Cancelado',
      expired: 'Expirado',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
        <p className="text-slate-600">Carregando assinantes...</p>
      </div>
    );
  }

  if (subscribers.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
        <p className="text-slate-600 mb-4">Você ainda não tem assinantes.</p>
        <p className="text-sm text-slate-500">Compartilhe seus planos para começar a receber pacientes!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="p-8 border-b border-slate-200">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Assinantes</h2>
        <p className="text-slate-600 mt-2">Total: {subscribers.length} assinantes</p>
      </div>

      <div className="divide-y divide-slate-200">
        {subscribers.map((sub) => (
          <div key={sub.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-slate-600 mt-1">ID: {sub.user_id}</p>
              </div>
              {getStatusBadge(sub.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                Início: {new Date(sub.started_at).toLocaleDateString('pt-BR')}
              </div>
              {sub.expires_at && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  Expira: {new Date(sub.expires_at).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}