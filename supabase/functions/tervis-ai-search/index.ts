import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { query, userId } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query é obrigatório' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const queryLower = query.toLowerCase();
    const locationMatch = queryLower.match(/em ([\w\s]+)/);
    const location = locationMatch ? locationMatch[1].trim() : '';

    let professionalsQuery = supabase
      .from('professionals')
      .select(`
        id,
        professional_type,
        description,
        address,
        verified,
        profiles!inner(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('verified', true)
      .limit(12);

    if (location) {
      professionalsQuery = professionalsQuery.or(
        `address->city.ilike.%${location}%,address->state.ilike.%${location}%`
      );
    }

    const { data: professionals, error: profError } = await professionalsQuery;

    if (profError) {
      throw profError;
    }

    const formattedProfessionals = (professionals || []).map((prof: any) => ({
      id: prof.id,
      full_name: prof.profiles.full_name,
      professional_type: prof.professional_type,
      description: prof.description || 'Profissional de saúde qualificado',
      avatar_url: prof.profiles.avatar_url,
      city: prof.address?.city || '',
      state: prof.address?.state || '',
      country: prof.address?.country || 'Brasil',
    }));

    let aiResponse = '';

    if (GEMINI_API_KEY && !queryLower.includes('profissional') && !queryLower.includes('doutor') && !queryLower.includes('médico')) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

      const systemPrompt = `Você é TERVIS.AI, um assistente de saúde em português. Regras CRÍTICAS:
1. NUNCA indique profissionais que não estejam na lista fornecida
2. NUNCA dê diagnósticos médicos
3. NUNCA prescreva medicamentos, remédios ou suplementos
4. SEMPRE sugira que o usuário busque um profissional de saúde adequado
5. SEMPRE incentive a fazer uma assinatura no AssineSaúde para ser atendido
6. Seja breve e objetivo (máximo 3-4 frases)
7. Foque apenas em países de língua portuguesa

Se a pergunta for sobre sintomas ou condições de saúde, responda de forma educativa mas SEMPRE indique que é necessário consultar um profissional. Encerre sempre sugerindo usar a plataforma AssineSaúde.`;

      const geminiPayload = {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPergunta do usuário: ${query}`,
              },
            ],
          },
        ],
      };

      try {
        const geminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(geminiPayload),
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          aiResponse =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Não foi possível gerar uma resposta no momento.';
        }
      } catch (geminiError) {
        console.error('Erro ao chamar Gemini:', geminiError);
      }
    }

    if (formattedProfessionals.length === 0) {
      aiResponse = `Não encontramos profissionais cadastrados para sua busca${location ? ` em ${location}` : ''}. Tente buscar em outras cidades próximas ou aguarde novos profissionais se cadastrarem na plataforma AssineSaúde.`;
    } else if (!aiResponse) {
      aiResponse = `Encontramos ${formattedProfessionals.length} profissionais disponíveis${location ? ` em ${location}` : ''}. Faça uma assinatura no AssineSaúde para ter acesso direto e contínuo ao profissional escolhido!`;
    }

    return new Response(
      JSON.stringify({
        professionals: formattedProfessionals,
        aiResponse,
        count: formattedProfessionals.length,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});