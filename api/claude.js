// api/claude.js — Proxy para Anthropic API + Slack Web API direto

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const anthropicKey = process.env.ANTHROPIC_KEY
  const slackToken   = process.env.SLACK_TOKEN

  // ── Rota Slack direta (sem MCP) ──────────────────────────
  if (req.body && req.body._slack_direct) {
    if (!slackToken) return res.status(500).json({ ok: false, error: 'SLACK_TOKEN não configurado' })
    const { channel, text } = req.body
    const slackResp = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + slackToken
      },
      body: JSON.stringify({ channel, text })
    })
    const slackData = await slackResp.json()
    return res.status(200).json(slackData)
  }

  // ── Rota Anthropic (com ou sem MCP) ──────────────────────
  if (!anthropicKey) return res.status(500).json({ error: 'ANTHROPIC_KEY não configurada' })

  try {
    const body = req.body
    // Injeta Slack token no MCP se disponível
    if (slackToken && body.mcp_servers) {
      body.mcp_servers = body.mcp_servers.map(s =>
        s.url && s.url.includes('slack') ? { ...s, authorization_token: slackToken } : s
      )
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'mcp-client-2025-04-04',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Proxy error: ' + error.message })
  }
}
