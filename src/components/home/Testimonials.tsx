import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '../../contexts/LanguageContext';

const professionalTestimonials = [
  {
    id: 1,
    text: "O AssineSaúde revolucionou meu consultório. Agora consigo gerenciar todos os meus pacientes de forma organizada e profissional.",
    author: "Dra. Marina Costa",
    location: "Florianópolis, Brasil",
    image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 2,
    text: "Excelente plataforma! Meus pacientes adoram a facilidade de agendamento e o sistema de assinaturas me trouxe mais estabilidade financeira.",
    author: "Dr. Rafael Mendes",
    location: "Curitiba, Brasil",
    image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 3,
    text: "A melhor decisão que tomei foi usar o AssineSaúde. Interface moderna, fácil de usar e o suporte é excepcional.",
    author: "Dra. Juliana Santos",
    location: "Belo Horizonte, Brasil",
    image: "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 4,
    text: "Como dentista em Luanda, esta plataforma facilitou muito o contacto com os meus pacientes. Recomendo vivamente!",
    author: "Dr. João Miguel",
    location: "Luanda, Angola",
    image: "https://images.pexels.com/photos/6812511/pexels-photo-6812511.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 5,
    text: "Finalmente uma plataforma que conecta profissionais de saúde de língua portuguesa! Tenho pacientes de vários países agora.",
    author: "Dra. Catarina Silva",
    location: "Lisboa, Portugal",
    image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 6,
    text: "Excelente sistema para gestão da minha clínica. Os meus pacientes em Maputo estão muito satisfeitos com a facilidade.",
    author: "Dr. Armando Sousa",
    location: "Maputo, Moçambique",
    image: "https://images.pexels.com/photos/6812522/pexels-photo-6812522.jpeg?auto=compress&cs=tinysrgb&w=300"
  }
];

const patientTestimonials = [
  {
    id: 1,
    text: "Consegui fazer um plano de saúde rapidinho para minha gatinha Luna! Ela está recebendo os melhores cuidados veterinários e eu estou super tranquila.",
    author: "Ana Paula Oliveira",
    location: "Porto Alegre, Brasil",
    image: "https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 2,
    text: "Encontrei uma psicóloga incrível através do AssineSaúde. A plataforma é muito fácil de usar e o atendimento é excelente!",
    author: "Lucas Fernandes",
    location: "São Paulo, Brasil",
    image: "https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 3,
    text: "Minha família toda usa o AssineSaúde. Cuidar da saúde ficou muito mais prático e acessível com o sistema de assinaturas.",
    author: "Carla Ribeiro",
    location: "Brasília, Brasil",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 4,
    text: "Desde que mudei para Lisboa, tinha dificuldade em encontrar dentista. Com o AssineSaúde, foi super fácil e rápido!",
    author: "Miguel Santos",
    location: "Lisboa, Portugal",
    image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 5,
    text: "Maravilhoso! Consegui consulta para meu filho com um pediatra excelente aqui na Praia. Recomendo muito!",
    author: "Maria Tavares",
    location: "Praia, Cabo Verde",
    image: "https://images.pexels.com/photos/3824771/pexels-photo-3824771.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 6,
    text: "Estava a precisar de fisioterapia e encontrei um profissional fantástico através do AssineSaúde. Muito satisfeito!",
    author: "António Ferreira",
    location: "Luanda, Angola",
    image: "https://images.pexels.com/photos/3783725/pexels-photo-3783725.jpeg?auto=compress&cs=tinysrgb&w=300"
  }
];

interface Testimonial {
  id: string | number;
  text: string;
  author: string;
  location: string;
  image: string;
}

export function Testimonials() {
  const { language, t } = useLanguage();
  const [professionalIndex, setProfessionalIndex] = useState(0);
  const [patientIndex, setPatientIndex] = useState(0);
  const [dbProfessionalTestimonials, setDbProfessionalTestimonials] = useState<Testimonial[]>(professionalTestimonials);
  const [dbPatientTestimonials, setDbPatientTestimonials] = useState<Testimonial[]>(patientTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, [language]);

  const fetchTestimonials = async () => {
    try {
      const { data: professionals } = await supabase
        .from('testimonials')
        .select(`
          id,
          content,
          photo_url,
          city,
          language_code,
          profiles (full_name)
        `)
        .eq('user_type', 'professional')
        .eq('is_published', true)
        .eq('language_code', language)
        .limit(20);

      const { data: patients } = await supabase
        .from('testimonials')
        .select(`
          id,
          content,
          photo_url,
          city,
          language_code,
          profiles (full_name)
        `)
        .eq('user_type', 'patient')
        .eq('is_published', true)
        .eq('language_code', language)
        .limit(30);

      if (professionals && professionals.length > 0) {
        const mappedProfessionals = professionals.map((t: any) => ({
          id: t.id,
          text: t.content,
          author: t.profiles?.full_name || 'Profissional de Saúde',
          location: t.city || 'Brasil',
          image: t.photo_url || 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300'
        }));
        setDbProfessionalTestimonials(mappedProfessionals);
      }

      if (patients && patients.length > 0) {
        const mappedPatients = patients.map((t: any) => ({
          id: t.id,
          text: t.content,
          author: t.profiles?.full_name || 'Paciente',
          location: t.city || 'Brasil',
          image: t.photo_url || 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=300'
        }));
        setDbPatientTestimonials(mappedPatients);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextProfessionals = () => {
    setProfessionalIndex((prev) => (prev + 1) % Math.max(1, dbProfessionalTestimonials.length - 2));
  };

  const prevProfessionals = () => {
    setProfessionalIndex((prev) => (prev - 1 + Math.max(1, dbProfessionalTestimonials.length - 2)) % Math.max(1, dbProfessionalTestimonials.length - 2));
  };

  const nextPatients = () => {
    setPatientIndex((prev) => (prev + 1) % Math.max(1, dbPatientTestimonials.length - 2));
  };

  const prevPatients = () => {
    setPatientIndex((prev) => (prev - 1 + Math.max(1, dbPatientTestimonials.length - 2)) % Math.max(1, dbPatientTestimonials.length - 2));
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-serif font-bold text-orange-600 mb-4">
            {t('testimonialsTitle')}
          </h2>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            {language === 'pt' ? 'Veja o que os profissionais de saúde estão dizendo' :
             language === 'it' ? 'Guarda cosa dicono i professionisti della salute' :
             language === 'es' ? 'Mira lo que dicen los profesionales de salud' :
             'See what health professionals are saying'}
          </p>
        </div>

        <div className="relative mb-32">
          <div className="flex items-center gap-4">
            <button
              onClick={prevProfessionals}
              className="flex-shrink-0 bg-white hover:bg-slate-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-brand-purple-600" />
            </button>

            <div className="overflow-hidden flex-1">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${professionalIndex * (100 / 3 + 2)}%)` }}
              >
                {dbProfessionalTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-[calc(33.333%-16px)]"
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full border border-slate-100">
                      <Quote className="w-12 h-12 text-brand-purple-400 mb-6 opacity-40" />
                      <p className="text-slate-700 mb-8 flex-grow leading-relaxed">
                        {testimonial.text}
                      </p>
                      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                          <img src={testimonial.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{testimonial.author}</p>
                          <p className="text-sm text-slate-500">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextProfessionals}
              className="flex-shrink-0 bg-white hover:bg-slate-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronRight className="w-6 h-6 text-brand-purple-600" />
            </button>
          </div>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-4xl font-serif font-bold text-orange-600 mb-4">
            {language === 'pt' ? 'Pacientes Felizes' :
             language === 'it' ? 'Pazienti Felici' :
             language === 'es' ? 'Pacientes Felices' :
             'Happy Patients'}
          </h2>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            {language === 'pt' ? 'Depoimentos de quem já utiliza nossos serviços' :
             language === 'it' ? 'Testimonianze di chi utilizza già i nostri servizi' :
             language === 'es' ? 'Testimonios de quienes ya usan nuestros servicios' :
             'Testimonials from those who already use our services'}
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4">
            <button
              onClick={prevPatients}
              className="flex-shrink-0 bg-white hover:bg-slate-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-brand-purple-600" />
            </button>

            <div className="overflow-hidden flex-1">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${patientIndex * (100 / 3 + 2)}%)` }}
              >
                {dbPatientTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-[calc(33.333%-16px)]"
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full border border-slate-100">
                      <Quote className="w-12 h-12 text-brand-purple-400 mb-6 opacity-40" />
                      <p className="text-slate-700 mb-8 flex-grow leading-relaxed">
                        {testimonial.text}
                      </p>
                      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                          <img src={testimonial.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{testimonial.author}</p>
                          <p className="text-sm text-slate-500">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextPatients}
              className="flex-shrink-0 bg-white hover:bg-slate-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronRight className="w-6 h-6 text-brand-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
