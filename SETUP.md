# Xtay Implantação v22 — Deploy no Lovable/Vercel

## O que está neste pacote

```
xtay-lovable/
├── public/
│   └── index.html      ← O assistente completo (todo o código que já funciona)
├── api/
│   └── claude.js       ← Proxy seguro que injeta a API key
└── vercel.json         ← Configuração de roteamento
```

**Como funciona:** o browser chama `/api/claude` (no mesmo domínio), o servidor injeta
a `ANTHROPIC_KEY` e repassa para a Anthropic. A key nunca sai do servidor.

---

## Passo 1 — Criar conta na Vercel (gratuito)

1. Acesse **vercel.com** e crie uma conta com o GitHub
2. (Se não tiver GitHub: github.com → criar conta gratuita)

---

## Passo 2 — Subir o projeto

### Opção A — Via GitHub (recomendado)
1. Crie um repositório novo no GitHub (pode ser privado)
2. Faça upload dos 3 arquivos/pastas deste zip
3. No Vercel: **Add New Project → Import Git Repository**
4. Selecione o repositório → **Deploy**

### Opção B — Via Vercel CLI
```bash
npm i -g vercel
cd xtay-lovable
vercel --prod
```

---

## Passo 3 — Configurar a API Key da Anthropic

1. Acesse **console.anthropic.com**
2. Crie uma conta → vá em **API Keys → Create Key**
3. Copie a chave (`sk-ant-api03-...`)
4. Adicione créditos em **Billing** (mínimo $5 — dura meses para uso moderado)

No Vercel:
1. Vá no seu projeto → **Settings → Environment Variables**
2. Adicione:
   - **Name:** `ANTHROPIC_KEY`
   - **Value:** `sk-ant-api03-...` (a chave que você copiou)
3. Clique **Save**
4. Vá em **Deployments → Redeploy** para aplicar

---

## Passo 4 — Acessar e compartilhar

Após o deploy, a Vercel gera um link como:
```
https://xtay-implantacao.vercel.app
```

Compartilhe esse link com todo o time Xtay.

### Instalar como app no desktop/celular
- **Chrome/Edge (PC):** clique nos 3 pontinhos → "Instalar Xtay Implantação"
- **Safari (iPhone/iPad):** botão compartilhar → "Adicionar à Tela de Início"
- **Android Chrome:** aparece banner automático ou menu → "Adicionar à tela inicial"

---

## Limitações desta versão

- **Dados:** cada pessoa ainda usa o localStorage do próprio navegador
  (os projetos não são compartilhados em tempo real entre o time ainda)
- **Slack DM:** funciona para envio — para receber respostas em tempo real
  é preciso configurar o token do Slack bot (ver abaixo)
- **Login:** não há autenticação — qualquer pessoa com o link acessa

## Próxima evolução (quando quiser)
Adicionar Supabase para dados compartilhados + login Google @xtay.com.br.
Já temos todo o código pronto no `xtay-app-v22.zip` entregue anteriormente.

---

## Configurar Slack Bot Token (opcional, para DM bidirecional)

1. Acesse **api.slack.com/apps → Create New App**
2. "From scratch" → nome: `Xtay Assistente` → workspace: Xtay
3. **OAuth & Permissions → Bot Token Scopes**, adicione:
   - `users:read` `users:read.email`
   - `im:read` `im:write` `im:history`
   - `chat:write`
4. **Install to Workspace** → copie o **Bot User OAuth Token** (`xoxb-...`)
5. No Vercel, adicione mais uma variável:
   - **Name:** `SLACK_BOT_TOKEN`
   - **Value:** `xoxb-...`
6. Em `api/claude.js`, o proxy já repassa o body inteiro — no HTML o MCP
   do Slack vai funcionar automaticamente com a autenticação do claude.ai
   quando a API key estiver configurada.

---

## Custo estimado

| Item | Custo |
|------|-------|
| Vercel (hosting) | Grátis |
| Anthropic API | ~$5-15/mês para o time Xtay |
| Domínio próprio (opcional) | ~R$50/ano |
