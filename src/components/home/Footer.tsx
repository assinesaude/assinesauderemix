import { useLanguage } from '../../contexts/LanguageContext';
import { Heart } from 'lucide-react';

export function Footer() {
  const { setLanguage } = useLanguage();

  const handleLogoClick = (lang: 'pt' | 'it' | 'es' | 'en', url: string) => {
    setLanguage(lang);
    window.location.href = url;
  };

  return (
    <footer className="w-full">
      <div className="bg-white py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-12">
            <button
              onClick={() => handleLogoClick('it', 'https://benetuo.it')}
              className="focus:outline-none px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="text-lg font-bold text-slate-700 hover:text-slate-900">Benetuo</span>
            </button>
            <button
              onClick={() => handleLogoClick('es', 'https://sumatesalud.es')}
              className="focus:outline-none px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="text-lg font-bold text-slate-700 hover:text-slate-900">SúmateSalud</span>
            </button>
            <button
              onClick={() => handleLogoClick('en', 'https://medlyou.com')}
              className="focus:outline-none px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="text-lg font-bold text-slate-700 hover:text-slate-900">Medlyou</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-brand-green-600 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-white" />
            <span className="text-xl font-bold text-white">AssineSaúde</span>
          </div>
          <p className="text-white/80 text-sm text-center">
            © {new Date().getFullYear()} AssineSaúde — Conectando profissionais de saúde e pacientes
          </p>
        </div>
      </div>
    </footer>
  );
}