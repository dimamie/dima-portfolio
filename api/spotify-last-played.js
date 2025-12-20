export default async function handler(req, res) {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
    if (!clientId || !clientSecret || !refreshToken) {
      return res.status(200).json({});
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResp = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken })
    });

    if (!tokenResp.ok) return res.status(200).json({});
    const tokenJson = await tokenResp.json();
    const accessToken = tokenJson.access_token;

    const recentResp = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!recentResp.ok) return res.status(200).json({});
    const recentJson = await recentResp.json();
    const item = (recentJson.items && recentJson.items[0] && recentJson.items[0].track) ? recentJson.items[0].track : null;
    return res.status(200).json({ item });
  } catch (e) {
    return res.status(200).json({});
  }
}

