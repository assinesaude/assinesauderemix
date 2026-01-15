import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface Subscriber {
  id: string;
  started_at: string;
  expires_at: string;
  status: string;
  amount_paid: number;
  billing_cycle: string;
  profiles: {
    full_name: string;
    email: string;
    phone: string | null;
  };
  benefit_plans: {
    name: string;
  };
}

export function SubscribersList() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!professional) return;

      const { data: plans } = await supabase
        .from('benefit_plans')
        .select('id')
        .eq('professional_id', professional.id);

      if (!plans || plans.length === 0) {
        setLoading(false);
        return;
      }

      const planIds = plans.map(p => p.id);

      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles:patient_id(full_name, email, phone),
          benefit_plans:plan_id(name)
        `)
        .in('plan_id', planIds)
        .order('started_at', { ascending: false });

      if (!error && data) {
        setSubscribers(data as any);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-slate-100 text-slate-800',
    };
    const labels = {
      active: 'Ativo',
      cancelled: 'Cancelado',
      expired: 'Expirado',
      suspended: 'Suspenso',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
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
                <h3 className="text-lg font-semibold text-slate-800">{sub.profiles?.full_name}</h3>
                <p className="text-sm text-slate-600 mt-1">Plano: {sub.benefit_plans?.name}</p>
              </div>
              {getStatusBadge(sub.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4" />
                {sub.profiles?.email}
              </div>
              {sub.profiles?.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  {sub.profiles.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                Início: {new Date(sub.started_at).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                Expira: {new Date(sub.expires_at).toLocaleDateString('pt-BR')}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-600">Valor pago: </span>
                <span className="font-semibold text-brand-purple-600">R$ {sub.amount_paid.toFixed(2)}</span>
                <span className="text-xs text-slate-500 ml-2">({sub.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
