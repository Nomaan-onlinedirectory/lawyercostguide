export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const apiKey = process.env.GOOGLE_PLACES_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Places API key not configured' });
  }
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }
  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.id,places.regularOpeningHours,places.location'
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 10,
        languageCode: 'en'
      })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Places service unavailable' });
  }
}
