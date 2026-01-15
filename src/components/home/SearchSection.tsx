import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Stethoscope, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const professions = [
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

interface LocationResult {
  country: string;
  state?: string;
  city: string;
  full_location: string;
}

export function SearchSection() {
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profession, setProfession] = useState('');
  const [specialty, setSpecialty] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-locations?q=${encodeURIComponent(query)}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.locations || []);
        setShowSuggestions((data.locations || []).length > 0);
      } else {
        console.error('API error:', response.status, await response.text());
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      fetchLocationSuggestions(value);
    }, 300);
  };

  const handleSelectLocation = (loc: LocationResult) => {
    setLocation(loc.full_location);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSearch = () => {
    console.log('Searching with:', { location, profession, specialty });
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-6">
          <div className="bg-gradient-to-r from-lime-500 to-blue-700 bg-clip-text text-transparent text-6xl font-extrabold">
            {t('brandTitle')}
          </div>

          <h1 className="text-5xl font-extrabold text-orange-500" style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' }}>
            {t('brandTagline')}
          </h1>

          <div className="space-y-3">
            <p className="text-blue-700 text-2xl">
              {t('brandSubtitle')}{' '}
              <span className="font-bold text-blue-800">{t('brandSubtitleBold')}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 relative" ref={inputRef}>
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-green-600" />
                {t('locationLabel')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  placeholder={t('locationPlaceholder')}
                  className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-brand-purple-600 animate-spin" />
                  </div>
                )}
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((loc, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full px-4 py-3 text-left hover:bg-brand-purple-50 transition-colors flex items-center gap-2 border-b border-slate-100 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-brand-green-600 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{loc.city}</span>
                        <span className="text-sm text-slate-500">
                          {loc.state ? `${loc.state}, ` : ''}{loc.country}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-brand-green-600" />
                {t('professionLabel')}
              </label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">{t('professionPlaceholder')}</option>
                {professions.map((prof) => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">{t('specialtyLabel')}</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder={t('specialtyPlaceholder')}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-brand-purple-600 to-brand-green-600 hover:from-brand-purple-700 hover:to-brand-green-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5" />
            {t('searchProfessionals')}
          </button>
        </div>
      </div>
    </section>
  );
}
