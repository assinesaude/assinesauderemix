import { Link } from 'react-router-dom';
import { User, ChevronDown, Globe } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function Header() {
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <Link to="/" className="block transition-transform hover:scale-105 duration-300">
              <img
                src="/assinesaude.png"
                alt="AssineSaúde"
                className="h-32 w-auto drop-shadow-lg"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{language}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                    <button
                      onClick={() => { setLanguage('pt'); setIsLangMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className="text-lg">🇧🇷</span> Português
                    </button>
                    <button
                      onClick={() => { setLanguage('it'); setIsLangMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className="text-lg">🇮🇹</span> Italiano
                    </button>
                    <button
                      onClick={() => { setLanguage('es'); setIsLangMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className="text-lg">🇪🇸</span> Español
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className="text-lg">🇺🇸</span> English
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              {profile ? (
                <div className="flex items-center gap-3">
                  <Link
                    to={
                      profile.user_type === 'admin'
                        ? '/admin/dashboard'
                        : profile.user_type === 'professional'
                        ? '/professional/dashboard'
                        : '/dashboard'
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-brand-green-500 text-white rounded-full hover:bg-brand-green-600 transition-colors shadow-md"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{profile.full_name}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-green-500 text-white rounded-full hover:bg-brand-green-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('login')}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isLoginMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLoginMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsLoginMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                        <Link
                          to="/login?type=admin"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setIsLoginMenuOpen(false)}
                        >
                          <div className="font-medium">{t('admin')}</div>
                          <div className="text-xs text-slate-500">{t('adminAccess')}</div>
                        </Link>
                        <Link
                          to="/login?type=professional"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setIsLoginMenuOpen(false)}
                        >
                          <div className="font-medium">{t('professional')}</div>
                          <div className="text-xs text-slate-500">{t('professionalDesc')}</div>
                        </Link>
                        <Link
                          to="/login?type=patient"
                          className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setIsLoginMenuOpen(false)}
                        >
                          <div className="font-medium">{t('patient')}</div>
                          <div className="text-xs text-slate-500">{t('patientDesc')}</div>
                        </Link>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
