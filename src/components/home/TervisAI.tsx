import { useState, useEffect } from 'react';
import { Mic, MicOff, Search, AlertCircle, Lock, Pill } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { BularioSearch } from './BularioSearch';

interface Professional {
  id: string;
  full_name: string;
  professional_type: string;
  city: string;
  state: string;
  country: string;
  description: string;
  avatar_url: string;
}

export function TervisAI() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<Professional[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [textSearchCount, setTextSearchCount] = useState(0);
  const [voiceSearchCount, setVoiceSearchCount] = useState(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const [showBulario, setShowBulario] = useState(false);

  useEffect(() => {
    checkUsage();
  }, []);

  const checkUsage = async () => {
    const today = new Date().toISOString().split('T')[0];

    if (user) {
      const { data } = await supabase
        .from('tervis_usage')
        .select('search_type')
        .eq('user_id', user.id)
        .eq('date', today);

      if (data) {
        setTextSearchCount(data.filter(d => d.search_type === 'text').length);
        setVoiceSearchCount(data.filter(d => d.search_type === 'voice').length);
      }
    } else {
      const { data } = await supabase
        .from('tervis_usage')
        .select('search_type')
        .eq('session_id', sessionId)
        .eq('date', today);

      if (data) {
        setTextSearchCount(data.filter(d => d.search_type === 'text').length);
        setVoiceSearchCount(data.filter(d => d.search_type === 'voice').length);
      }
    }
  };

  const trackUsage = async (searchType: 'text' | 'voice') => {
    await supabase.from('tervis_usage').insert({
      user_id: user?.id || null,
      session_id: sessionId,
      search_type: searchType,
      query: query,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleVoiceSearch = () => {
    if (voiceSearchCount >= 10) {
      setError('Você atingiu o limite diário de 10 buscas por voz.');
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setError('Erro ao capturar voz. Tente novamente.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Por favor, digite ou fale o que você procura.');
      return;
    }

    const searchType = isListening ? 'voice' : 'text';

    if (searchType === 'text' && textSearchCount >= 20) {
      setError('Você atingiu o limite diário de 20 buscas por texto.');
      return;
    }

    if (searchType === 'voice' && voiceSearchCount >= 10) {
      setError('Você atingiu o limite diário de 10 buscas por voz.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setAiResponse('');

    try {
      await trackUsage(searchType);

      if (searchType === 'text') {
        setTextSearchCount(prev => prev + 1);
      } else {
        setVoiceSearchCount(prev => prev + 1);
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tervis-ai-search`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, userId: user?.id })
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar resultados');
      }

      const data = await response.json();
      setResults(data.professionals || []);
      setAiResponse(data.aiResponse || '');
    } catch (err) {
      setError('Erro ao processar sua busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showBulario && <BularioSearch onClose={() => setShowBulario(false)} />}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center gap-8 mb-8">
          <img
            src="/TERVISAIBONITO.png"
            alt="TERVIS.AI"
            className="h-24"
          />

          <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <p className="text-sm text-slate-600 mb-4">
                Digite o profissional que você precisa ou clique no microfone e pergunte para o TERVIS.AI
              </p>

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ex: Dentista em São Paulo ou Psicólogo no Rio de Janeiro"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  disabled={loading || isListening || voiceSearchCount >= 10}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title="Busca por voz"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  type="submit"
                  disabled={loading || !query.trim() || textSearchCount >= 20}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  title="Busca por texto"
                >
                  <Search className="w-5 h-5" />
                  Buscar
                </button>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-slate-500">Busca por texto ou por voz</p>
                <button
                  type="button"
                  onClick={() => setShowBulario(true)}
                  className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  <Pill className="w-4 h-4" />
                  Consultar Bulário ANVISA
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {aiResponse && (
          <div className="max-w-3xl mx-auto mb-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">TERVIS.AI Responde:</h3>
            <p className="text-blue-800">{aiResponse}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="max-w-6xl mx-auto">
            {!user && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3 text-yellow-800">
                <Lock className="w-5 h-5 flex-shrink-0" />
                <p>
                  <strong>Faça login para ver os resultados completos.</strong> Os resultados abaixo estão parcialmente ocultos.
                </p>
              </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!user ? 'blur-sm' : ''}`}>
              {results.map((prof) => (
                <div key={prof.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={prof.avatar_url || 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300'}
                      alt={prof.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800">{prof.full_name}</h3>
                      <p className="text-sm text-blue-600">{prof.professional_type}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-3">
                    {prof.description?.substring(0, 100)}...
                  </p>

                  <p className="text-sm text-slate-500">
                    📍 {prof.city}, {prof.state} - {prof.country}
                  </p>

                  <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Ver Perfil e Assinar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
