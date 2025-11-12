# Guia Completo de Deploy no Hostinger via Ubuntu

## Pré-requisitos

Antes de começar, certifique-se de ter:

1. Conta ativa no Hostinger com plano de hospedagem
2. Acesso SSH ao servidor (fornecido pelo Hostinger)
3. Domínio registrado e apontado para o Hostinger
4. Node.js e npm instalados localmente
5. Git instalado no servidor
6. Credenciais do Supabase (já configuradas no `.env`)

---

## Parte 1: Preparação do Projeto Local

### 1.1 Build do Projeto

No seu computador Ubuntu, navegue até a pasta do projeto e execute:

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Criar build de produção
npm run build
```

Isso criará uma pasta `dist/` com os arquivos compilados.

### 1.2 Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

**IMPORTANTE:** Nunca commite o arquivo `.env` no Git. Ele já está no `.gitignore`.

---

## Parte 2: Configuração do Servidor Hostinger

### 2.1 Acesso SSH ao Servidor

Abra o terminal no Ubuntu e conecte-se via SSH:

```bash
ssh usuario@seu-dominio.com -p porta
# OU
ssh usuario@ip-do-servidor -p porta
```

**Onde encontrar essas informações:**
- Painel Hostinger → Hospedagem → Gerenciar → Acesso SSH
- Usuário: geralmente é `u123456789` (fornecido pelo Hostinger)
- Porta: geralmente 65002 ou outra porta personalizada
- Senha: definida por você no painel

### 2.2 Instalar Node.js no Servidor (se necessário)

```bash
# Verificar se Node.js está instalado
node --version
npm --version

# Se não estiver instalado, instalar via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar o shell
source ~/.bashrc

# Instalar Node.js LTS
nvm install --lts
nvm use --lts
```

### 2.3 Criar Estrutura de Diretórios

```bash
# Navegar para o diretório público (public_html ou domains)
cd ~/public_html
# OU
cd ~/domains/seu-dominio.com/public_html

# Criar pasta para o projeto (opcional, você pode usar direto na public_html)
mkdir assinesaude
cd assinesaude
```

---

## Parte 3: Upload dos Arquivos

### Opção A: Via SCP (Recomendado)

No seu computador Ubuntu (não no servidor):

```bash
# Navegar até a pasta do projeto
cd /caminho/para/seu/projeto

# Fazer upload da pasta dist
scp -P porta -r dist/* usuario@seu-dominio.com:~/public_html/assinesaude/

# Fazer upload do .env (IMPORTANTE!)
scp -P porta .env usuario@seu-dominio.com:~/public_html/assinesaude/.env
```

### Opção B: Via FTP/SFTP

1. Use um cliente FTP como FileZilla
2. Conecte-se usando as credenciais SFTP do Hostinger:
   - Host: seu-dominio.com ou IP do servidor
   - Usuário: fornecido pelo Hostinger
   - Senha: sua senha SSH
   - Porta: 22 ou porta SSH personalizada
3. Navegue até `public_html/assinesaude/`
4. Faça upload de todo o conteúdo da pasta `dist/`
5. Faça upload do arquivo `.env`

### Opção C: Via Git (Recomendado para Atualizações Futuras)

**No seu repositório local:**

```bash
# Adicionar arquivos ao Git (certifique-se de que .env está no .gitignore)
git add .
git commit -m "Preparar para deploy"
git push origin main
```

**No servidor via SSH:**

```bash
cd ~/public_html/assinesaude

# Clonar o repositório
git clone https://seu-repositorio-git.git .

# Criar arquivo .env manualmente
nano .env
# Cole as variáveis de ambiente e salve (Ctrl+O, Enter, Ctrl+X)

# Instalar dependências
npm install

# Build do projeto
npm run build

# Mover arquivos da pasta dist para o diretório público
mv dist/* .
rm -rf dist
```

---

## Parte 4: Configuração do .htaccess

No servidor, crie ou edite o arquivo `.htaccess` para configurar o roteamento:

```bash
cd ~/public_html/assinesaude
nano .htaccess
```

Adicione o seguinte conteúdo:

```apache
# Habilitar RewriteEngine
RewriteEngine On

# Forçar HTTPS (Recomendado)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirecionar todas as requisições para index.html (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^.*$ /index.html [L]

# Habilitar compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
</IfModule>

# Cache de arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Segurança: Impedir listagem de diretórios
Options -Indexes

# Segurança: Proteger arquivos sensíveis
<FilesMatch "^\.env$">
  Order allow,deny
  Deny from all
</FilesMatch>
```

Salve o arquivo (Ctrl+O, Enter, Ctrl+X).

---

## Parte 5: Configuração DNS no Hostinger

### 5.1 Acessar Painel DNS

1. Faça login no [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Vá em **Domínios** → Selecione seu domínio → **DNS / Nameservers**

### 5.2 Configurar Registros DNS

Configure os seguintes registros DNS:

#### Registro A (Apontar domínio para o servidor)

```
Tipo: A
Nome: @ (ou deixe em branco)
Valor: IP_DO_SERVIDOR_HOSTINGER
TTL: 14400 (ou padrão)
```

#### Registro A para www

```
Tipo: A
Nome: www
Valor: IP_DO_SERVIDOR_HOSTINGER
TTL: 14400
```

#### Registro CNAME (Alternativa para www)

```
Tipo: CNAME
Nome: www
Valor: seu-dominio.com
TTL: 14400
```

### 5.3 Configuração para Subdomínio (Opcional)

Se quiser usar `app.seu-dominio.com` ou `assinesaude.seu-dominio.com`:

```
Tipo: A
Nome: app (ou assinesaude)
Valor: IP_DO_SERVIDOR_HOSTINGER
TTL: 14400
```

### 5.4 Configuração de Email (Opcional mas Recomendado)

```
Tipo: MX
Nome: @ (ou deixe em branco)
Valor: mx1.hostinger.com
Prioridade: 10
TTL: 14400

Tipo: MX
Nome: @ (ou deixe em branco)
Valor: mx2.hostinger.com
Prioridade: 20
TTL: 14400
```

### 5.5 Registro SPF (Prevenir Spam)

```
Tipo: TXT
Nome: @
Valor: v=spf1 include:_spf.hostinger.com ~all
TTL: 14400
```

**IMPORTANTE:** Aguarde entre 24-48 horas para propagação completa do DNS (geralmente 2-6 horas).

---

## Parte 6: Configuração SSL (HTTPS)

### 6.1 Ativar SSL Gratuito no Hostinger

1. Painel Hostinger → **Hospedagem** → Seu domínio → **SSL**
2. Clique em "Instalar SSL Gratuito" (Let's Encrypt)
3. Aguarde 15-30 minutos para ativação

### 6.2 Forçar HTTPS

Já configurado no `.htaccess` acima. Verifique se está funcionando acessando:
- `http://seu-dominio.com` → deve redirecionar para `https://seu-dominio.com`

---

## Parte 7: Configuração de Variáveis de Ambiente no Servidor

### 7.1 Criar arquivo .env no Servidor

```bash
cd ~/public_html/assinesaude
nano .env
```

Cole o seguinte conteúdo (substitua pelos seus valores reais):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_muito_longa_aqui
```

**IMPORTANTE:** O arquivo `.env` deve estar protegido no `.htaccess` (já configurado acima).

### 7.2 Verificar Permissões

```bash
# Definir permissões corretas
chmod 600 .env

# Verificar
ls -la .env
# Deve mostrar: -rw------- (apenas o proprietário pode ler/escrever)
```

---

## Parte 8: Estrutura Final do Servidor

Após o deploy, a estrutura deve estar assim:

```
~/public_html/assinesaude/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── public/
│   └── (imagens e outros arquivos estáticos)
├── .env
├── .htaccess
└── .gitignore (se usar Git)
```

---

## Parte 9: Configuração do Supabase para Produção

### 9.1 Configurar URL do Site no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Authentication** → **URL Configuration**
4. Adicione:
   - **Site URL:** `https://seu-dominio.com`
   - **Redirect URLs:**
     - `https://seu-dominio.com`
     - `https://seu-dominio.com/dashboard`
     - `https://www.seu-dominio.com`

### 9.2 Configurar CORS no Supabase

As Edge Functions já têm CORS configurado, mas verifique:

1. **Supabase** → **Settings** → **API**
2. Em **CORS allowed origins**, adicione:
   - `https://seu-dominio.com`
   - `https://www.seu-dominio.com`

---

## Parte 10: Testes e Verificação

### 10.1 Testar o Site

Acesse `https://seu-dominio.com` e verifique:

- [ ] Site carrega corretamente
- [ ] HTTPS está ativo (cadeado verde no navegador)
- [ ] Login funciona
- [ ] Cadastro de profissional funciona
- [ ] Autocompletar de localização funciona
- [ ] Dashboard carrega corretamente
- [ ] Imagens carregam corretamente

### 10.2 Testar em Diferentes Dispositivos

- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (Android, iOS)
- [ ] Tablet

### 10.3 Verificar Console do Navegador

Abra o DevTools (F12) e verifique se não há erros no console.

### 10.4 Verificar Performance

Use ferramentas como:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

---

## Parte 11: Comandos Úteis para Manutenção

### Atualizar o Site

```bash
# Conectar via SSH
ssh usuario@seu-dominio.com -p porta

# Navegar até o diretório
cd ~/public_html/assinesaude

# Se usar Git
git pull origin main
npm install
npm run build
mv dist/* .
rm -rf dist

# Se usar SCP (no computador local)
npm run build
scp -P porta -r dist/* usuario@seu-dominio.com:~/public_html/assinesaude/
```

### Ver Logs de Erro

```bash
# Ver últimas 50 linhas do log de erro
tail -n 50 ~/public_html/assinesaude/error_log
```

### Limpar Cache

```bash
cd ~/public_html/assinesaude

# Remover arquivos antigos de build
rm -rf assets/*.js assets/*.css

# Fazer novo upload dos arquivos
```

### Backup do Site

```bash
# Criar backup completo
cd ~
tar -czf backup-assinesaude-$(date +%Y%m%d).tar.gz public_html/assinesaude/

# Baixar backup para o computador local (no seu Ubuntu)
scp -P porta usuario@seu-dominio.com:~/backup-assinesaude-*.tar.gz ~/backups/
```

---

## Parte 12: Troubleshooting

### Problema: Site não carrega

**Solução:**
```bash
# Verificar se os arquivos estão no lugar certo
ls -la ~/public_html/assinesaude/

# Verificar permissões
chmod 755 ~/public_html/assinesaude
find ~/public_html/assinesaude -type f -exec chmod 644 {} \;
find ~/public_html/assinesaude -type d -exec chmod 755 {} \;
```

### Problema: Erro 404 ao navegar

**Solução:** Verificar se o `.htaccess` está configurado corretamente.

### Problema: Variáveis de ambiente não funcionam

**Solução:**
```bash
# Verificar se o .env existe e tem as variáveis corretas
cat ~/public_html/assinesaude/.env

# As variáveis VITE_ devem estar compiladas no build
# Se mudou as variáveis, precisa fazer rebuild local e reenviar
```

### Problema: SSL não funciona

**Solução:**
1. Aguardar 24-48h para propagação DNS
2. Forçar renovação SSL no painel Hostinger
3. Verificar se o domínio está apontado corretamente

### Problema: Rotas não funcionam (404)

**Solução:** Adicionar no `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/'
})
```

E rebuildar o projeto.

---

## Parte 13: Segurança Adicional

### 13.1 Proteger Diretórios Sensíveis

```bash
# Criar .htaccess em diretórios sensíveis
cd ~/public_html/assinesaude
echo "deny from all" > src/.htaccess
```

### 13.2 Configurar Headers de Segurança

Adicione ao `.htaccess`:

```apache
# Headers de Segurança
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
```

### 13.3 Backup Automático

Configure backups automáticos no painel Hostinger:
1. **Hospedagem** → **Backups**
2. Ativar backup automático semanal

---

## Checklist Final de Deploy

- [ ] Build do projeto compilado com sucesso
- [ ] Arquivos enviados para o servidor
- [ ] Arquivo .env configurado no servidor
- [ ] .htaccess configurado corretamente
- [ ] DNS configurado e propagado
- [ ] SSL instalado e funcionando
- [ ] URLs do Supabase atualizadas
- [ ] Site testado em produção
- [ ] Backup inicial criado
- [ ] Performance verificada
- [ ] Segurança configurada

---

## Informações de Suporte

### Hostinger

- Suporte 24/7: [hpanel.hostinger.com/support](https://hpanel.hostinger.com/support)
- Base de conhecimento: [support.hostinger.com](https://support.hostinger.com)
- Chat ao vivo disponível no painel

### Supabase

- Documentação: [supabase.com/docs](https://supabase.com/docs)
- Dashboard: [app.supabase.com](https://app.supabase.com)
- Discord: [discord.supabase.com](https://discord.supabase.com)

---

## Manutenção Contínua

### Tarefas Semanais

- [ ] Verificar logs de erro
- [ ] Monitorar uso do Supabase
- [ ] Verificar uptime do site

### Tarefas Mensais

- [ ] Atualizar dependências (`npm update`)
- [ ] Verificar e renovar SSL (automático)
- [ ] Revisar backups

### Tarefas Trimestrais

- [ ] Atualizar versões principais (`npm outdated`)
- [ ] Revisar performance
- [ ] Testar recuperação de backup

---

**Última atualização:** Outubro 2025
**Versão do documento:** 1.0
