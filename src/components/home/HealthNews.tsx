import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image?: string;
}

export function HealthNews() {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchHealthNews();
  }, [language]);

  const nextArticles = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, articles.length - 4));
  };

  const prevArticles = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, articles.length - 4)) % Math.max(1, articles.length - 4));
  };

  const getFallbackArticles = (): NewsArticle[] => {
    return [
      {
        title: 'Avanços na Medicina Preventiva',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'Novas tecnologias estão revolucionando a medicina preventiva...',
        image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Saúde Mental: Importância do Acompanhamento',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'Especialistas recomendam consultas regulares com profissionais...',
        image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Nutrição Inteligente e Personalizada',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'A nutrigenômica permite criar dietas personalizadas...',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Telemedicina Transforma Acesso à Saúde',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'A telemedicina se consolida como alternativa eficaz...',
        image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Exercícios Físicos e Longevidade',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: '30 minutos de atividade física diária aumentam expectativa...',
        image: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Inovações em Diagnóstico Precoce',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'Novas tecnologias permitem detectar doenças mais cedo...',
        image: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Alimentação Funcional Ganha Destaque',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'Alimentos funcionais trazem benefícios além da nutrição...',
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Terapias Alternativas Complementam Tratamentos',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'Medicina integrativa combina abordagens para melhor resultado...',
        image: 'https://images.pexels.com/photos/3376797/pexels-photo-3376797.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Qualidade do Sono e Saúde Mental',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'Estudos revelam conexão crucial entre sono e bem-estar...',
        image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        title: 'Prevenção de Doenças Crônicas',
        link: 'https://healthnews.today',
        pubDate: new Date().toISOString(),
        description: 'Hábitos saudáveis reduzem risco de doenças crônicas...',
        image: 'https://images.pexels.com/photos/4498365/pexels-photo-4498365.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ];
  };

  const fetchHealthNews = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/fetch-health-news?lang=${language}`);
      const data = await response.json();

      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const latestArticles = data.items.slice(0, 10).map((item: any) => ({
          title: item.title || 'Notícia de Saúde',
          link: item.link || 'https://www.healthnews.today',
          pubDate: item.pubDate || new Date().toISOString(),
          description: item.description || 'Confira esta notícia importante sobre saúde.',
          image: item.image || 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=600'
        }));
        setArticles(latestArticles);
        setError(false);
      } else {
        setArticles(getFallbackArticles());
      }
    } catch (err) {
      console.error('Error fetching health news:', err);
      setArticles(getFallbackArticles());
      setError(false);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/healthnewstoday.png"
            alt="HealthNews.Today"
            className="h-10 w-auto"
          />
          <h2 className="text-2xl font-bold text-slate-800">
            {t('healthNewsTitle')}
          </h2>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4">
            <button
              onClick={prevArticles}
              className="flex-shrink-0 bg-white hover:bg-slate-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>

            <div className="overflow-hidden flex-1">
              <div
                className="flex gap-4 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (25 + 1)}%)` }}
              >
                {articles.map((article, index) => (
                  <a
                    key={index}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-[calc(25%-12px)] group"
                  >
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-400 h-full">
                      <div className="relative h-32 overflow-hidden bg-slate-100">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=300';
                          }}
                        />
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(article.pubDate)}</span>
                        </div>

                        <h3 className="font-semibold text-sm text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {article.description}
                        </p>

                        <div className="flex items-center gap-1 text-blue-600 font-medium text-xs group-hover:gap-2 transition-all">
                          <span>{t('readMore')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <button
              onClick={nextArticles}
              className="flex-shrink-0 bg-white hover:bg-slate-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
