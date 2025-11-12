import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type Language = 'pt' | 'it' | 'es' | 'en';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  login: {
    pt: 'Login',
    it: 'Accedi',
    es: 'Iniciar sesión',
    en: 'Login'
  },
  logout: {
    pt: 'Sair',
    it: 'Esci',
    es: 'Salir',
    en: 'Logout'
  },
  admin: {
    pt: 'Admin',
    it: 'Amministratore',
    es: 'Administrador',
    en: 'Admin'
  },
  adminAccess: {
    pt: 'Acesso administrativo',
    it: 'Accesso amministrativo',
    es: 'Acceso administrativo',
    en: 'Administrative access'
  },
  professional: {
    pt: 'Profissional',
    it: 'Professionista',
    es: 'Profesional',
    en: 'Professional'
  },
  professionalDesc: {
    pt: 'Médicos e terapeutas',
    it: 'Medici e terapisti',
    es: 'Médicos y terapeutas',
    en: 'Doctors and therapists'
  },
  patient: {
    pt: 'Paciente',
    it: 'Paziente',
    es: 'Paciente',
    en: 'Patient'
  },
  patientDesc: {
    pt: 'Acesso para pacientes',
    it: 'Accesso per pazienti',
    es: 'Acceso para pacientes',
    en: 'Patient access'
  },
  searchPlaceholder: {
    pt: 'Buscar profissionais, especialidades...',
    it: 'Cerca professionisti, specialità...',
    es: 'Buscar profesionales, especialidades...',
    en: 'Search professionals, specialties...'
  },
  searchButton: {
    pt: 'Buscar',
    it: 'Cerca',
    es: 'Buscar',
    en: 'Search'
  },
  heroTitle: {
    pt: 'Sua saúde em primeiro lugar',
    it: 'La tua salute al primo posto',
    es: 'Tu salud primero',
    en: 'Your health comes first'
  },
  heroSubtitle: {
    pt: 'Encontre os melhores profissionais de saúde perto de você',
    it: 'Trova i migliori professionisti della salute vicino a te',
    es: 'Encuentra los mejores profesionales de salud cerca de ti',
    en: 'Find the best health professionals near you'
  },
  professionalCardTitle: {
    pt: 'Para Profissionais',
    it: 'Per Professionisti',
    es: 'Para Profesionales',
    en: 'For Professionals'
  },
  professionalCardDesc: {
    pt: 'Cadastre-se e conecte-se com pacientes',
    it: 'Registrati e connettiti con i pazienti',
    es: 'Regístrate y conéctate con pacientes',
    en: 'Register and connect with patients'
  },
  professionalCardButton: {
    pt: 'Cadastrar como Profissional',
    it: 'Registrati come Professionista',
    es: 'Registrarse como Profesional',
    en: 'Register as Professional'
  },
  patientCardTitle: {
    pt: 'Para Pacientes',
    it: 'Per Pazienti',
    es: 'Para Pacientes',
    en: 'For Patients'
  },
  patientCardDesc: {
    pt: 'Encontre e agende com profissionais de saúde',
    it: 'Trova e prenota con professionisti della salute',
    es: 'Encuentra y agenda con profesionales de salud',
    en: 'Find and book with health professionals'
  },
  patientCardButton: {
    pt: 'Entrar como Paciente',
    it: 'Accedi come Paziente',
    es: 'Entrar como Paciente',
    en: 'Login as Patient'
  },
  servicesTitle: {
    pt: 'Nossos Serviços',
    it: 'I Nostri Servizi',
    es: 'Nuestros Servicios',
    en: 'Our Services'
  },
  tervisAITitle: {
    pt: 'Tervis AI',
    it: 'Tervis AI',
    es: 'Tervis AI',
    en: 'Tervis AI'
  },
  tervisAISubtitle: {
    pt: 'Sua assistente de saúde inteligente',
    it: 'Il tuo assistente sanitario intelligente',
    es: 'Tu asistente de salud inteligente',
    en: 'Your intelligent health assistant'
  },
  tervisAIPlaceholder: {
    pt: 'Pergunte algo sobre saúde...',
    it: 'Chiedi qualcosa sulla salute...',
    es: 'Pregunta algo sobre salud...',
    en: 'Ask something about health...'
  },
  tervisAISend: {
    pt: 'Enviar',
    it: 'Invia',
    es: 'Enviar',
    en: 'Send'
  },
  testimonialsTitle: {
    pt: 'O que dizem nossos usuários',
    it: 'Cosa dicono i nostri utenti',
    es: 'Lo que dicen nuestros usuarios',
    en: 'What our users say'
  },
  healthNewsTitle: {
    pt: 'Últimas Notícias de Saúde',
    it: 'Ultime Notizie sulla Salute',
    es: 'Últimas Noticias de Salud',
    en: 'Latest Health News'
  },
  readMore: {
    pt: 'Ler mais',
    it: 'Leggi di più',
    es: 'Leer más',
    en: 'Read more'
  },
  loading: {
    pt: 'Carregando...',
    it: 'Caricamento...',
    es: 'Cargando...',
    en: 'Loading...'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectLanguageFromDomain = async (): Promise<Language> => {
  const hostname = window.location.hostname;

  try {
    const { data, error } = await supabase
      .from('countries')
      .select('language_code')
      .ilike('domain', `%${hostname}%`)
      .maybeSingle();

    if (data && !error) {
      return data.language_code as Language;
    }
  } catch (error) {
    console.error('Error detecting language from domain:', error);
  }

  return 'pt';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      const saved = localStorage.getItem('language');

      if (saved) {
        setLanguageState(saved as Language);
      } else {
        const detectedLang = await detectLanguageFromDomain();
        setLanguageState(detectedLang);
      }

      setIsInitialized(true);
    };

    initializeLanguage();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('language', language);
    }
  }, [language, isInitialized]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
