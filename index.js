const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const API_KEY = 'YOUR_SKYSCANNER_API_KEY';

app.get('/flights', async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    // Perform API request to Skyscanner
    const response = await axios.get('https://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/IN/INR/en-US/', {
      params: {
        apiKey: API_KEY,
        country: 'IN',
        currency: 'INR',
        locale: 'en-US',
        originplace: source,
        destinationplace: destination,
        outbounddate: date,
        adults: 1,
      },
    });

    // Extract flight prices for IndiGo, AirAsia, and Vistara
    const prices = {};
    for (const quote of response.data.Quotes) {
      const airlineId = quote.OutboundLeg.CarrierIds[0];
      const airline = response.data.Carriers.find(carrier => carrier.CarrierId === airlineId);
      
      if (airline.Name === 'IndiGo' || airline.Name === 'AirAsia' || airline.Name === 'Vistara') {
        prices[airline.Name] = `₹${quote.MinPrice}`;
      }
    }

    res.json(prices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
