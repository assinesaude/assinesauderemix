import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LogOut, Settings, Image as ImageIcon, MessageSquare, FileText, Globe, ChevronDown } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { VectorIconsManager } from '../../components/admin/VectorIconsManager';
import { TestimonialsManager } from '../../components/admin/TestimonialsManager';
import { ContractMirrorsManager } from '../../components/admin/ContractMirrorsManager';
import { CountriesManager } from '../../components/admin/CountriesManager';

interface Country {
  id: string;
  name: string;
  code: string;
  language_code: string;
  domain: string | null;
}

export function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'icons' | 'testimonials' | 'contracts' | 'countries'>('overview');
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (data && data.length > 0) {
        setCountries(data);
        if (!selectedCountry) {
          setSelectedCountry(data[0]);
          setLanguage(data[0].language_code as 'pt' | 'it' | 'es' | 'en');
        }
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setLanguage(country.language_code as 'pt' | 'it' | 'es' | 'en');
    setIsCountryMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (profile?.user_type !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-purple-50/30 to-brand-green-50/30">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Settings className="w-8 h-8 text-brand-purple-600" />
              <div>
                <h1 className="text-2xl font-serif font-bold text-slate-800">
                  {language === 'pt' ? 'Painel Admin' :
                   language === 'it' ? 'Pannello Admin' :
                   language === 'es' ? 'Panel Admin' :
                   'Admin Panel'}
                </h1>
                <p className="text-sm text-slate-600">
                  {selectedCountry?.name || 'AssineSaúde'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-purple-100 hover:bg-brand-purple-200 rounded-xl transition-colors"
                >
                  <Globe className="w-5 h-5 text-brand-purple-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-brand-purple-900">
                      {selectedCountry?.name || t('selectCountry') || 'Select Country'}
                    </p>
                    <p className="text-xs text-brand-purple-600">
                      {selectedCountry?.language_code.toUpperCase()}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCountryMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCountryMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCountryMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20 max-h-96 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.id}
                          onClick={() => handleCountryChange(country)}
                          className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                            selectedCountry?.id === country.id ? 'bg-brand-purple-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-slate-900">{country.name}</p>
                              <p className="text-xs text-slate-500">
                                {country.language_code.toUpperCase()} • {country.domain || 'No domain'}
                              </p>
                            </div>
                            {selectedCountry?.id === country.id && (
                              <div className="w-2 h-2 bg-brand-green-500 rounded-full" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{profile.full_name}</p>
                <p className="text-sm text-slate-600">{t('admin') || 'Administrator'}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('logout') || 'Sair'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="flex gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-brand-purple-600 border-b-2 border-brand-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Settings className="w-5 h-5" />
{language === 'pt' ? 'Visão Geral' :
               language === 'it' ? 'Panoramica' :
               language === 'es' ? 'Visión General' :
               'Overview'}
            </button>
            <button
              onClick={() => setActiveTab('icons')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'icons'
                  ? 'text-brand-purple-600 border-b-2 border-brand-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
{language === 'pt' ? 'Ícones de Profissionais' :
               language === 'it' ? 'Icone Professionisti' :
               language === 'es' ? 'Iconos de Profesionales' :
               'Professional Icons'}
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'testimonials'
                  ? 'text-brand-purple-600 border-b-2 border-brand-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
{language === 'pt' ? 'Depoimentos' :
               language === 'it' ? 'Testimonianze' :
               language === 'es' ? 'Testimonios' :
               'Testimonials'}
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'contracts'
                  ? 'text-brand-purple-600 border-b-2 border-brand-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <FileText className="w-5 h-5" />
{language === 'pt' ? 'Contratos por País' :
               language === 'it' ? 'Contratti per Paese' :
               language === 'es' ? 'Contratos por País' :
               'Contracts by Country'}
            </button>
            <button
              onClick={() => setActiveTab('countries')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'countries'
                  ? 'text-brand-purple-600 border-b-2 border-brand-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Globe className="w-5 h-5" />
{language === 'pt' ? 'Gerenciar Países' :
               language === 'it' ? 'Gestisci Paesi' :
               language === 'es' ? 'Gestionar Países' :
               'Manage Countries'}
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-4">
              {language === 'pt' ? 'Dashboard Administrativo' :
               language === 'it' ? 'Pannello Amministrativo' :
               language === 'es' ? 'Panel Administrativo' :
               'Administrative Dashboard'}
            </h2>
            <div className="space-y-6">
              <div className="bg-brand-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-brand-purple-900 mb-2">
                  {language === 'pt' ? 'País Selecionado' :
                   language === 'it' ? 'Paese Selezionato' :
                   language === 'es' ? 'País Seleccionado' :
                   'Selected Country'}
                </h3>
                <p className="text-slate-700">
                  {language === 'pt' ? 'Você está gerenciando' :
                   language === 'it' ? 'Stai gestendo' :
                   language === 'es' ? 'Estás gestionando' :
                   'You are managing'}: <strong>{selectedCountry?.name}</strong>
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  {language === 'pt' ? 'Idioma' :
                   language === 'it' ? 'Lingua' :
                   language === 'es' ? 'Idioma' :
                   'Language'}: {selectedCountry?.language_code.toUpperCase()}
                </p>
                {selectedCountry?.domain && (
                  <p className="text-sm text-slate-600">
                    {language === 'pt' ? 'Domínio' :
                     language === 'it' ? 'Dominio' :
                     language === 'es' ? 'Dominio' :
                     'Domain'}: {selectedCountry.domain}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <VectorIconsManager selectedCountry={selectedCountry} />
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <TestimonialsManager selectedCountry={selectedCountry} />
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <ContractMirrorsManager selectedCountry={selectedCountry} />
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <CountriesManager onCountriesChange={fetchCountries} />
          </div>
        )}
      </main>
    </div>
  );
}
