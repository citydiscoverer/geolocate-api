const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.get('/detectLocation', async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing latitude or longitude parameters' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return res.status(500).json({ error: 'Geocoding failed' });
    }

    const result = data.results[0];
    const components = result.address_components;

    const getComponent = (type) => {
      const component = components.find(c => c.types.includes(type));
      return component ? component.long_name : null;
    };

    res.json({
      city: getComponent('locality'),
      state: getComponent('administrative_area_level_1'),
      country: getComponent('country'),
      postalCode: getComponent('postal_code'),
      formattedAddress: result.formatted_address
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
