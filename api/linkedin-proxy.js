export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, method = 'GET', body: linkedinBody, token } = req.body || {};

  if (!endpoint || !token) {
    return res.status(400).json({ error: 'Missing required fields: endpoint, token' });
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `https://api.linkedin.com${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: method !== 'GET' ? JSON.stringify(linkedinBody) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
