import { useLanguage } from '../../contexts/LanguageContext';

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
              className="focus:outline-none"
            >
              <img
                src="/Benetuo.png"
                alt="Benetuo"
                className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </button>
            <button
              onClick={() => handleLogoClick('es', 'https://sumatesalud.es')}
              className="focus:outline-none"
            >
              <img
                src="/logo.png"
                alt="SúmateSalud"
                className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </button>
            <button
              onClick={() => handleLogoClick('en', 'https://medlyou.com')}
              className="focus:outline-none"
            >
              <img
                src="/Medlyou.png"
                alt="Medlyou"
                className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </button>
          </div>
        </div>
      </div>

      <img
        src="/FOOOOTEEERR.png"
        alt="AssineSaúde Footer"
        className="w-full h-auto block"
      />
    </footer>
  );
}
