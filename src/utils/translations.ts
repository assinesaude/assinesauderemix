type Language = 'pt' | 'it' | 'es' | 'en';

export const translations: Record<string, Record<Language, string>> = {
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
  },
  brandTitle: {
    pt: 'ASSINESAÚDE',
    it: 'BENETUO',
    es: 'SÚMATESALUD',
    en: 'MEDLYOU'
  },
  brandTagline: {
    pt: 'A mesma língua que nos conecta',
    it: 'La stessa lingua che ci connette',
    es: 'El mismo idioma que nos conecta',
    en: 'The same language that connects us'
  },
  brandSubtitle: {
    pt: 'Agora conecta profissionais da saúde dos',
    it: 'Ora connette i professionisti della salute dei',
    es: 'Ahora conecta profesionales de salud de',
    en: 'Now connects health professionals from'
  },
  brandSubtitleBold: {
    pt: 'nossos países',
    it: 'nostri paesi',
    es: 'nuestros países',
    en: 'our countries'
  },
  locationLabel: {
    pt: 'Localização',
    it: 'Posizione',
    es: 'Ubicación',
    en: 'Location'
  },
  locationPlaceholder: {
    pt: 'Digite bairro, cidade, estado ou país',
    it: 'Digita quartiere, città, stato o paese',
    es: 'Digite barrio, ciudad, estado o país',
    en: 'Enter neighborhood, city, state or country'
  },
  professionLabel: {
    pt: 'Profissão',
    it: 'Professione',
    es: 'Profesión',
    en: 'Profession'
  },
  professionPlaceholder: {
    pt: 'Selecione a profissão',
    it: 'Seleziona la professione',
    es: 'Seleccione la profesión',
    en: 'Select profession'
  },
  specialtyLabel: {
    pt: 'Especialidade',
    it: 'Specialità',
    es: 'Especialidad',
    en: 'Specialty'
  },
  specialtyPlaceholder: {
    pt: 'Digite a especialidade',
    it: 'Digita la specialità',
    es: 'Digite la especialidad',
    en: 'Enter specialty'
  },
  searchProfessionals: {
    pt: 'Buscar Profissionais',
    it: 'Cerca Professionisti',
    es: 'Buscar Profesionales',
    en: 'Search Professionals'
  }
};
