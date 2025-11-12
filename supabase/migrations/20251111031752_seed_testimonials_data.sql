/*
  # Seed Testimonials Data

  1. Data Seeding
    - Creates temporary user profiles for testimonials
    - Adds 20 professional testimonials from various Portuguese-speaking countries
    - Adds 30 patient testimonials with enthusiastic feedback
    
  2. Content Themes
    - Innovation and technology praise
    - Disruption of traditional health plans
    - Cost savings and value
    - Quality of service
    - International reach
*/

DO $$
DECLARE
  temp_user_id uuid;
BEGIN
  temp_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (temp_user_id, 'testimonials@assinesaude.com', crypt('temp_password_' || temp_user_id::text, gen_salt('bf')), now(), now(), now())
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO profiles (id, user_type, full_name, created_at)
  VALUES (temp_user_id, 'professional', 'Sistema AssineSaúde', now())
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO testimonials (user_id, user_type, content, photo_url, city, is_published) VALUES
  (temp_user_id, 'professional', 'O AssineSaúde revolucionou completamente minha clínica. A tecnologia é impressionante e meus pacientes adoram!', 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300', 'Florianópolis, Brasil', true),
  (temp_user_id, 'professional', 'Nunca vi uma plataforma tão completa para profissionais de saúde. O sistema de assinaturas me deu estabilidade financeira.', 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300', 'Curitiba, Brasil', true),
  (temp_user_id, 'professional', 'Excelente ferramenta! Consegui expandir meu atendimento para pacientes de outros países lusófonos.', 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=300', 'Belo Horizonte, Brasil', true),
  (temp_user_id, 'professional', 'Como dentista em Luanda, esta plataforma facilitou muito o contacto com os meus pacientes. Tecnologia de ponta!', 'https://images.pexels.com/photos/6812511/pexels-photo-6812511.jpeg?auto=compress&cs=tinysrgb&w=300', 'Luanda, Angola', true),
  (temp_user_id, 'professional', 'A inovação do AssineSaúde é incrível. Meus pacientes em Lisboa estão muito satisfeitos com o atendimento digital.', 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300', 'Lisboa, Portugal', true),
  (temp_user_id, 'professional', 'Sistema perfeito para gestão da minha clínica em Maputo. A tecnologia realmente funciona!', 'https://images.pexels.com/photos/6812522/pexels-photo-6812522.jpeg?auto=compress&cs=tinysrgb&w=300', 'Maputo, Moçambique', true),
  (temp_user_id, 'professional', 'Como psicóloga, o AssineSaúde me permitiu atender pacientes de todo o mundo lusófono. Simplesmente revolucionário!', 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300', 'Porto, Portugal', true),
  (temp_user_id, 'professional', 'A melhor plataforma de saúde que já usei! O suporte técnico é excepcional e a interface é intuitiva.', 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300', 'São Paulo, Brasil', true),
  (temp_user_id, 'professional', 'Incrível como consegui triplicar minha base de pacientes em apenas 3 meses usando o AssineSaúde.', 'https://images.pexels.com/photos/6812593/pexels-photo-6812593.jpeg?auto=compress&cs=tinysrgb&w=300', 'Benguela, Angola', true),
  (temp_user_id, 'professional', 'A tecnologia do AssineSaúde está anos à frente dos concorrentes. Meu consultório nunca esteve tão organizado!', 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300', 'Brasília, Brasil', true),
  (temp_user_id, 'professional', 'Como fisioterapeuta na Praia, esta plataforma me conectou com pacientes que jamais alcançaria. Fantástico!', 'https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg?auto=compress&cs=tinysrgb&w=300', 'Praia, Cabo Verde', true),
  (temp_user_id, 'professional', 'O sistema de agendamento é perfeito! Reduziu drasticamente as faltas e otimizou minha agenda.', 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=300', 'Coimbra, Portugal', true),
  (temp_user_id, 'professional', 'AssineSaúde é a revolução que a saúde precisava! A gestão financeira ficou muito mais simples.', 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300', 'Recife, Brasil', true),
  (temp_user_id, 'professional', 'Tecnologia impecável! Meus pacientes em Quelimane adoram a facilidade de marcar consultas online.', 'https://images.pexels.com/photos/6812511/pexels-photo-6812511.jpeg?auto=compress&cs=tinysrgb&w=300', 'Quelimane, Moçambique', true),
  (temp_user_id, 'professional', 'Como nutricionista, o AssineSaúde me permitiu criar planos personalizados e acompanhar meus pacientes remotamente.', 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300', 'Salvador, Brasil', true),
  (temp_user_id, 'professional', 'Plataforma inovadora! Consegui aumentar minha renda em 60% com o sistema de assinaturas.', 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300', 'Faro, Portugal', true),
  (temp_user_id, 'professional', 'O melhor investimento que fiz na minha carreira! A plataforma é completa e muito profissional.', 'https://images.pexels.com/photos/6812522/pexels-photo-6812522.jpeg?auto=compress&cs=tinysrgb&w=300', 'Beira, Moçambique', true),
  (temp_user_id, 'professional', 'Como veterinário, adoro poder atender pets de toda a comunidade lusófona. A telemedicina funciona perfeitamente!', 'https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg?auto=compress&cs=tinysrgb&w=300', 'Fortaleza, Brasil', true),
  (temp_user_id, 'professional', 'Sistema espetacular! A integração com pagamentos e gestão de pacientes é perfeita.', 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300', 'Mindelo, Cabo Verde', true),
  (temp_user_id, 'professional', 'AssineSaúde transformou minha prática clínica. A inovação está em cada detalhe da plataforma!', 'https://images.pexels.com/photos/6812593/pexels-photo-6812593.jpeg?auto=compress&cs=tinysrgb&w=300', 'Huambo, Angola', true);

  INSERT INTO testimonials (user_id, user_type, content, photo_url, city, is_published) VALUES
  (temp_user_id, 'patient', 'Isso vai acabar com os planos de saúde tradicionais! Finalmente uma alternativa moderna e acessível.', 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=300', 'Porto Alegre, Brasil', true),
  (temp_user_id, 'patient', 'Cancelando meu plano agora mesmo e fazendo um AssineSaúde! A economia é absurda.', 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=300', 'São Paulo, Brasil', true),
  (temp_user_id, 'patient', 'Nunca mais vou pagar uma fortuna por um plano com serviços que eu nem preciso! AssineSaúde é o futuro!', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300', 'Brasília, Brasil', true),
  (temp_user_id, 'patient', 'A tecnologia é impressionante! Consegui consulta em 5 minutos. Os planos tradicionais estão acabados.', 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300', 'Lisboa, Portugal', true),
  (temp_user_id, 'patient', 'Inovação pura! Finalmente um serviço de saúde que pensa no bolso do paciente.', 'https://images.pexels.com/photos/3824771/pexels-photo-3824771.jpeg?auto=compress&cs=tinysrgb&w=300', 'Praia, Cabo Verde', true),
  (temp_user_id, 'patient', 'Acabei de cancelar meu plano de saúde caríssimo. AssineSaúde tem tudo que eu preciso por uma fração do preço!', 'https://images.pexels.com/photos/3783725/pexels-photo-3783725.jpeg?auto=compress&cs=tinysrgb&w=300', 'Luanda, Angola', true),
  (temp_user_id, 'patient', 'A revolução da saúde chegou! Atendimento rápido, tecnologia de ponta e preço justo.', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300', 'Rio de Janeiro, Brasil', true),
  (temp_user_id, 'patient', 'Minha família toda migrou pro AssineSaúde. Economizamos mais de 70% e o atendimento é melhor!', 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=300', 'Curitiba, Brasil', true),
  (temp_user_id, 'patient', 'Tecnologia incrível! Consegui fazer teleconsulta com um especialista em Portugal sem sair de casa.', 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=300', 'Belo Horizonte, Brasil', true),
  (temp_user_id, 'patient', 'Isso sim é inovação! Chega de pagar caro por planos que não atendem nossas necessidades.', 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=300', 'Porto, Portugal', true),
  (temp_user_id, 'patient', 'O atendimento é excepcional e a plataforma é super fácil de usar. AssineSaúde é o futuro da saúde!', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300', 'Maputo, Moçambique', true),
  (temp_user_id, 'patient', 'Cancelei meu plano tradicional sem pensar duas vezes. A economia e qualidade do AssineSaúde são incomparáveis!', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=300', 'Fortaleza, Brasil', true),
  (temp_user_id, 'patient', 'Finalmente posso escolher os profissionais que eu quero sem burocracia! Isso vai mudar o mercado de saúde.', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300', 'Salvador, Brasil', true),
  (temp_user_id, 'patient', 'A tecnologia do AssineSaúde é anos-luz à frente dos planos tradicionais. Simplesmente perfeito!', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300', 'Coimbra, Portugal', true),
  (temp_user_id, 'patient', 'Consegui plano para meu cachorro também! Nunca vi tanta praticidade e economia juntas.', 'https://images.pexels.com/photos/1181524/pexels-photo-1181524.jpeg?auto=compress&cs=tinysrgb&w=300', 'Recife, Brasil', true),
  (temp_user_id, 'patient', 'Os planos de saúde tradicionais estão ultrapassados. AssineSaúde é a verdadeira inovação!', 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=300', 'Mindelo, Cabo Verde', true),
  (temp_user_id, 'patient', 'Pago menos e tenho mais opções! Essa é a revolução que a saúde precisava.', 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300', 'Faro, Portugal', true),
  (temp_user_id, 'patient', 'A praticidade é surreal! Marquei consulta, fiz teleconsulta e paguei tudo pelo app. Adeus planos caros!', 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=300', 'Benguela, Angola', true),
  (temp_user_id, 'patient', 'Nunca mais vou aceitar as limitações dos planos tradicionais. AssineSaúde me deu liberdade!', 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=300', 'Goiânia, Brasil', true),
  (temp_user_id, 'patient', 'A inovação chegou na saúde! Tecnologia, economia e qualidade em um só lugar.', 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=300', 'Beira, Moçambique', true),
  (temp_user_id, 'patient', 'Meus pais cancelaram o plano que tinham há 20 anos e estão muito mais felizes com o AssineSaúde!', 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=300', 'Manaus, Brasil', true),
  (temp_user_id, 'patient', 'A novidade que vai acabar com os planos de saúde abusivos! Preço justo e atendimento de qualidade.', 'https://images.pexels.com/photos/1181575/pexels-photo-1181575.jpeg?auto=compress&cs=tinysrgb&w=300', 'Belém, Brasil', true),
  (temp_user_id, 'patient', 'Tecnologia incrível, atendimento humanizado e economia real. AssineSaúde é revolucionário!', 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=300', 'Quelimane, Moçambique', true),
  (temp_user_id, 'patient', 'Chega de pagar caro por carência, burocracia e serviços que não uso. AssineSaúde é liberdade!', 'https://images.pexels.com/photos/1181619/pexels-photo-1181619.jpeg?auto=compress&cs=tinysrgb&w=300', 'Natal, Brasil', true),
  (temp_user_id, 'patient', 'A melhor decisão da minha vida! Economia, praticidade e profissionais excelentes.', 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300', 'Huambo, Angola', true),
  (temp_user_id, 'patient', 'AssineSaúde está mudando o jogo! Os planos tradicionais vão ter que se reinventar ou vão sumir.', 'https://images.pexels.com/photos/1181719/pexels-photo-1181719.jpeg?auto=compress&cs=tinysrgb&w=300', 'Vitória, Brasil', true),
  (temp_user_id, 'patient', 'A inovação que eu esperava! Finalmente posso cuidar da minha saúde sem gastar uma fortuna.', 'https://images.pexels.com/photos/1181736/pexels-photo-1181736.jpeg?auto=compress&cs=tinysrgb&w=300', 'Campo Grande, Brasil', true),
  (temp_user_id, 'patient', 'Recomendo para todo mundo! Tecnologia de ponta, preço justo e atendimento impecável.', 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=300', 'Braga, Portugal', true),
  (temp_user_id, 'patient', 'Cancelando meu plano de saúde e migrando pro AssineSaúde agora mesmo! A diferença é gritante.', 'https://images.pexels.com/photos/1181805/pexels-photo-1181805.jpeg?auto=compress&cs=tinysrgb&w=300', 'João Pessoa, Brasil', true),
  (temp_user_id, 'patient', 'Essa é a verdadeira disrupção na saúde! AssineSaúde veio para ficar e revolucionar tudo.', 'https://images.pexels.com/photos/1181825/pexels-photo-1181825.jpeg?auto=compress&cs=tinysrgb&w=300', 'Aracaju, Brasil', true);
END $$;
