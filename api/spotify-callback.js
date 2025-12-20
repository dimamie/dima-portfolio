export default async function handler(req, res) {
  try {
    const code = req.query.code;
    const redirectUri = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/spotify-callback`;

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    if (!code || !clientId || !clientSecret) {
      return res.status(400).send('Missing code or Spotify credentials');
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResp = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) {
      return res.status(400).json(tokenJson);
    }

    const refresh = tokenJson.refresh_token;
    const access = tokenJson.access_token;
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(
`Copy this refresh token into Vercel env as SPOTIFY_REFRESH_TOKEN:\n\n${refresh}\n\n(You can now remove this endpoint or leave it.)`);
  } catch (e) {
    return res.status(500).send('Error exchanging code');
  }
}

