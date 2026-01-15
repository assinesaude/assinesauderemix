import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';

const BUSINESS_TYPES = ['Consultório', 'Clínica', 'Hospital'];

const PROFESSIONAL_TYPES = [
  'Médico(a)',
  'Médico(a) Veterinário(a)',
  'Biomédico(a)',
  'Dentista',
  'Fisioterapeuta',
  'Fonoaudiólogo(a)',
  'Quiropraxista',
  'Psicólogo(a)',
  'Psicanalista',
  'Nutricionista',
  'Enfermeiro(a)',
  'Farmacêutico(a)'
];

const NOMENCLATURES = [
  'Plano de Benefícios',
  'Programa de Cuidados',
  'Cartão de Benefícios'
];

const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function RegisterProfessional() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomenclature: '',
    businessType: '',
    professionalType: '',
    paymentPreference: 'platform',
    pixKey: '',
    fullName: '',
    cpf: '',
    councilNumber: '',
    councilState: '',
    phone: '',
    whatsapp: false,
    email: '',
    password: '',
    confirmPassword: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      await signUp(formData.email, formData.password, formData.fullName, 'professional');

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Erro ao criar usuário');

      const { error: profError } = await supabase.from('professionals').insert({
        user_id: userData.user.id,
        professional_type: formData.professionalType,
        council_number: formData.councilNumber,
        council_state: formData.councilState,
        business_type: formData.businessType,
        payment_preference: formData.paymentPreference,
        pix_key: formData.pixKey || null,
        subscription_status: 'pending'
      });

      if (profError) throw profError;

      alert('Cadastro realizado com sucesso! Aguarde a aprovação da equipe AssineSaúde.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-slate-800">Informações da Oferta</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nomenclatura Comercial
        </label>
        <select
          value={formData.nomenclature}
          onChange={(e) => updateField('nomenclature', e.target.value)}
          required
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
        >
          <option value="">Selecione uma opção</option>
          {NOMENCLATURES.map(nom => (
            <option key={nom} value={nom}>{nom}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Tipo de Estabelecimento
        </label>
        <div className="grid grid-cols-3 gap-4">
          {BUSINESS_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => updateField('businessType', type)}
              className={`py-3 px-4 rounded-xl border-2 transition-all ${
                formData.businessType === type
                  ? 'border-brand-purple-500 bg-brand-purple-50 text-brand-purple-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Profissão
        </label>
        <select
          value={formData.professionalType}
          onChange={(e) => updateField('professionalType', e.target.value)}
          required
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
        >
          <option value="">Selecione sua profissão</option>
          {PROFESSIONAL_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-slate-800">Dados Pessoais</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CPF</label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => updateField('cpf', e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Número do Conselho
          </label>
          <input
            type="text"
            value={formData.councilNumber}
            onChange={(e) => updateField('councilNumber', e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">UF do Conselho</label>
          <select
            value={formData.councilState}
            onChange={(e) => updateField('councilState', e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
          >
            <option value="">Selecione</option>
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Telefone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            checked={formData.whatsapp}
            onChange={(e) => updateField('whatsapp', e.target.checked)}
            className="w-5 h-5 text-brand-purple-600"
          />
          <label className="text-sm text-slate-700">Este telefone é WhatsApp</label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Senha</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    if (step === 1) {
      return formData.nomenclature && formData.businessType && formData.professionalType;
    }
    if (step === 2) {
      return formData.fullName && formData.cpf && formData.councilNumber &&
             formData.councilState && formData.phone && formData.email &&
             formData.password && formData.confirmPassword;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-purple-50/30 to-brand-green-50/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Link to="/">
            <img
              src="/assinesaude.png"
              alt="AssineSaúde"
              className="h-20 w-auto mx-auto mb-4"
            />
          </Link>
          <p className="text-slate-600">Cadastro de Profissional</p>
        </div>

        <div className="mb-10 flex justify-center gap-4">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                s < step ? 'bg-brand-green-500 text-white' :
                s === step ? 'bg-brand-purple-600 text-white' :
                'bg-slate-200 text-slate-500'
              }`}>
                {s < step ? <Check className="w-6 h-6" /> : s}
              </div>
              {s < 2 && <div className={`w-24 h-1 mx-2 transition-all ${s < step ? 'bg-brand-green-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}

            <div className="flex justify-between mt-10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-6 py-3 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </button>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-purple-600 to-brand-green-600 hover:from-brand-purple-700 hover:to-brand-green-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-xl transition-all shadow-lg"
                >
                  Próximo
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-purple-600 to-brand-green-600 hover:from-brand-purple-700 hover:to-brand-green-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-xl transition-all shadow-lg"
                >
                  {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link to="/login" className="text-sm text-brand-purple-600 hover:text-brand-purple-700">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
