# Deploy Rápido no Hostinger - Passo a Passo

## ⚡ Versão Express (15-30 minutos)

---

## ANTES DE COMEÇAR

✅ **Você precisa ter:**
1. Conta ativa no Hostinger
2. Domínios registrados:
   - assinesaude.com.br (Brasil/Português)
   - benetuo.it (Itália/Italiano)
   - sumatesalud.es (Espanha/Espanhol)
   - medlyou.com (EUA/Inglês)
3. Credenciais SSH do Hostinger
4. Projeto já buildado (`npm run build`)

---

## PASSO 1: BUILD LOCAL (2 min)

```bash
# Na pasta do projeto no seu computador
npm run build
```

✅ **Verificar:** Pasta `dist/` foi criada com sucesso

---

## PASSO 2: PREPARAR .ENV (1 min)

Seu arquivo `.env` deve conter:

```env
VITE_SUPABASE_URL=https://[seu-projeto].supabase.co
VITE_SUPABASE_ANON_KEY=[sua-chave-anonima]
```

⚠️ **IMPORTANTE:** Anote essas informações, você vai precisar delas no servidor!

---

## PASSO 3: ACESSAR HOSTINGER SSH (2 min)

### Obter credenciais SSH:
1. Acesse [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. **Hospedagem** → Selecione o domínio → **Acesso SSH**
3. Anote:
   - **Usuário:** `u123456789` (exemplo)
   - **Host:** seu IP ou domínio
   - **Porta:** geralmente 65002

### Conectar via SSH:

```bash
ssh u123456789@seu-ip -p 65002
```

Digite a senha quando solicitado.

---

## PASSO 4: CRIAR ESTRUTURA NO SERVIDOR (1 min)

```bash
# Ir para o diretório público
cd ~/public_html

# Criar pasta para cada domínio (4 vezes, uma para cada)
mkdir -p assinesaude.com.br
mkdir -p benetuo.it
mkdir -p sumatesalud.es
mkdir -p medlyou.com
```

---

## PASSO 5: UPLOAD DOS ARQUIVOS (3-5 min)

### No seu computador (NOVA ABA DO TERMINAL):

```bash
# Para assinesaude.com.br
scp -P 65002 -r dist/* u123456789@seu-ip:~/public_html/assinesaude.com.br/

# Para benetuo.it
scp -P 65002 -r dist/* u123456789@seu-ip:~/public_html/benetuo.it/

# Para sumatesalud.es
scp -P 65002 -r dist/* u123456789@seu-ip:~/public_html/sumatesalud.es/

# Para medlyou.com
scp -P 65002 -r dist/* u123456789@seu-ip:~/public_html/medlyou.com/
```

⚠️ **Substitua:**
- `65002` → sua porta SSH
- `u123456789` → seu usuário SSH
- `seu-ip` → IP ou domínio do servidor

---

## PASSO 6: CRIAR .ENV EM CADA DOMÍNIO (3 min)

### No terminal SSH (volte para a aba do SSH):

```bash
# Para assinesaude.com.br
cd ~/public_html/assinesaude.com.br
nano .env
```

**Cole:**
```env
VITE_SUPABASE_URL=https://[seu-projeto].supabase.co
VITE_SUPABASE_ANON_KEY=[sua-chave-anonima]
```

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

**Repita para os outros 3 domínios:**

```bash
# benetuo.it
cd ~/public_html/benetuo.it
nano .env
# Cole as mesmas variáveis

# sumatesalud.es
cd ~/public_html/sumatesalud.es
nano .env
# Cole as mesmas variáveis

# medlyou.com
cd ~/public_html/medlyou.com
nano .env
# Cole as mesmas variáveis
```

---

## PASSO 7: CRIAR .HTACCESS (4 min)

### Para cada domínio, crie o arquivo .htaccess:

```bash
# assinesaude.com.br
cd ~/public_html/assinesaude.com.br
nano .htaccess
```

**Cole este conteúdo:**

```apache
RewriteEngine On

# Forçar HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA Routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^.*$ /index.html [L]

# Proteger .env
<FilesMatch "^\.env$">
  Order allow,deny
  Deny from all
</FilesMatch>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

**Copiar para os outros domínios:**

```bash
# Copiar o .htaccess para os outros domínios
cp ~/public_html/assinesaude.com.br/.htaccess ~/public_html/benetuo.it/
cp ~/public_html/assinesaude.com.br/.htaccess ~/public_html/sumatesalud.es/
cp ~/public_html/assinesaude.com.br/.htaccess ~/public_html/medlyou.com/
```

---

## PASSO 8: AJUSTAR PERMISSÕES (1 min)

```bash
# Para cada domínio
cd ~/public_html
chmod -R 755 assinesaude.com.br benetuo.it sumatesalud.es medlyou.com
chmod 600 assinesaude.com.br/.env benetuo.it/.env sumatesalud.es/.env medlyou.com/.env
```

---

## PASSO 9: CONFIGURAR DNS (5-10 min)

### No Painel Hostinger:

1. Vá em **Domínios** → Selecione cada domínio → **DNS / Nameservers**

### Para CADA domínio, adicione:

**Registro A (principal):**
```
Tipo: A
Nome: @ (ou deixe vazio)
Valor: [IP do servidor Hostinger]
TTL: 14400
```

**Registro A (www):**
```
Tipo: A
Nome: www
Valor: [IP do servidor Hostinger]
TTL: 14400
```

✅ **Repita para todos os 4 domínios!**

⏰ **Aguarde 1-6 horas para propagação DNS**

---

## PASSO 10: ATIVAR SSL (2 min)

### Para CADA domínio:

1. Painel Hostinger → **Hospedagem**
2. Selecione o domínio
3. Clique em **SSL**
4. **Instalar SSL Gratuito** (Let's Encrypt)
5. Aguarde 15-30 minutos para ativação

✅ **Repita para todos os 4 domínios!**

---

## PASSO 11: CONFIGURAR SUPABASE (3 min)

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. **Authentication** → **URL Configuration**

**Adicione TODAS as URLs:**

**Site URLs:**
- `https://assinesaude.com.br`
- `https://benetuo.it`
- `https://sumatesalud.es`
- `https://medlyou.com`

**Redirect URLs:**
- `https://assinesaude.com.br/**`
- `https://www.assinesaude.com.br/**`
- `https://benetuo.it/**`
- `https://www.benetuo.it/**`
- `https://sumatesalud.es/**`
- `https://www.sumatesalud.es/**`
- `https://medlyou.com/**`
- `https://www.medlyou.com/**`

---

## PASSO 12: CADASTRAR PAÍSES NO BANCO (2 min)

1. Acesse [app.supabase.com](https://app.supabase.com)
2. **Table Editor** → tabela `countries`
3. **Insert** → **Insert row**

**Cadastre os 4 países:**

| name | code | language_code | domain |
|------|------|---------------|---------|
| Brasil | BR | pt | assinesaude.com.br |
| Italia | IT | it | benetuo.it |
| España | ES | es | sumatesalud.es |
| United States | US | en | medlyou.com |

---

## PASSO 13: TESTAR! (5 min)

### Teste cada domínio:

✅ **assinesaude.com.br** → Deve carregar em PORTUGUÊS
✅ **benetuo.it** → Deve carregar em ITALIANO
✅ **sumatesalud.es** → Deve carregar em ESPANHOL
✅ **medlyou.com** → Deve carregar em INGLÊS

### Verificar:
- [ ] Site carrega
- [ ] HTTPS funciona (cadeado verde)
- [ ] Idioma correto
- [ ] Login funciona
- [ ] Notícias carregam traduzidas
- [ ] Cards de profissionais/pacientes traduzidos

---

## 🚨 TROUBLESHOOTING RÁPIDO

### Site não carrega?
```bash
# Verificar arquivos
ls -la ~/public_html/assinesaude.com.br/
# Deve mostrar: index.html, assets/, .env, .htaccess
```

### Erro 404 ao navegar?
```bash
# Verificar .htaccess
cat ~/public_html/assinesaude.com.br/.htaccess
```

### Variáveis de ambiente não funcionam?
```bash
# Verificar .env
cat ~/public_html/assinesaude.com.br/.env
# Deve mostrar as variáveis VITE_
```

### SSL não funciona?
- Aguarde 24-48h para propagação DNS
- Force renovação SSL no painel Hostinger

### Idioma errado?
- Verifique se os países estão cadastrados corretamente no Supabase
- Verifique se o campo `domain` está sem `http://` ou `www`

---

## 📋 CHECKLIST FINAL

- [ ] Build local executado
- [ ] Arquivos enviados para os 4 domínios
- [ ] .env criado em cada domínio
- [ ] .htaccess criado em cada domínio
- [ ] Permissões ajustadas
- [ ] DNS configurado para os 4 domínios
- [ ] SSL instalado nos 4 domínios
- [ ] URLs configuradas no Supabase
- [ ] 4 países cadastrados no banco
- [ ] Todos os sites testados e funcionando

---

## 🎯 COMANDOS RESUMIDOS (COPIAR E COLAR)

### No servidor SSH (executar na ordem):

```bash
# 1. Criar estrutura
cd ~/public_html
mkdir -p assinesaude.com.br benetuo.it sumatesalud.es medlyou.com

# 2. Ajustar permissões (após upload)
chmod -R 755 assinesaude.com.br benetuo.it sumatesalud.es medlyou.com
chmod 600 assinesaude.com.br/.env benetuo.it/.env sumatesalud.es/.env medlyou.com/.env

# 3. Verificar estrutura
ls -la assinesaude.com.br/
ls -la benetuo.it/
ls -la sumatesalud.es/
ls -la medlyou.com/
```

### No seu computador (ajuste os valores):

```bash
# Upload para todos os domínios
scp -P 65002 -r dist/* usuario@ip:~/public_html/assinesaude.com.br/
scp -P 65002 -r dist/* usuario@ip:~/public_html/benetuo.it/
scp -P 65002 -r dist/* usuario@ip:~/public_html/sumatesalud.es/
scp -P 65002 -r dist/* usuario@ip:~/public_html/medlyou.com/
```

---

## ⏰ TEMPO TOTAL ESTIMADO

- **Preparação:** 5 min
- **Upload:** 10 min
- **Configuração:** 15 min
- **DNS/SSL:** 30 min (espera)
- **Total ativo:** ~30 minutos
- **Total com espera:** 1-2 horas

---

## 📞 SUPORTE

**Hostinger:**
- Chat 24/7: [hpanel.hostinger.com](https://hpanel.hostinger.com)

**Supabase:**
- Docs: [supabase.com/docs](https://supabase.com/docs)

---

**✅ Pronto! Seus 4 sites multilíngues estão no ar!**
