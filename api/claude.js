// api/claude.js — Proxy seguro para a Anthropic API
// A API key fica no servidor (variável de ambiente), nunca exposta ao browser

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Lê a API key do ambiente (configurada no Lovable/Vercel)
  const apiKey = process.env.ANTHROPIC_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_KEY não configurada no servidor' })
  }

  try {
    const body = req.body

    // Injeta o Slack token no MCP config se disponível
    const slackToken = process.env.SLACK_TOKEN
    if (slackToken && body.mcp_servers) {
      body.mcp_servers = body.mcp_servers.map(s => {
        if (s.url && s.url.includes('slack.com')) {
          return { ...s, authorization_token: slackToken }
        }
        return s
      })
    }

    // Repassa a chamada para a Anthropic, adicionando a key
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'mcp-client-2025-04-04',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // Retorna o resultado para o browser
    return res.status(response.status).json(data)

  } catch (error) {
    console.error('Proxy error:', error)
    return res.status(500).json({ error: 'Erro no proxy: ' + error.message })
  }
}
