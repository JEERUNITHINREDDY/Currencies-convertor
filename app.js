const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const API_KEY = 'bcdc269c06f9f821c467fabf'; 
const BASE_URL = `https://open.er-api.com/v6/latest/`;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { result: null, error: null });
});

app.post('/convert', async (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  try {
    const response = await axios.get(`${BASE_URL}${fromCurrency}?api_key=${API_KEY}`);
    const rates = response.data.rates;

    if (!rates[toCurrency]) {
      return res.render('index', { result: null, error: 'Invalid target currency' });
    }

    const convertedAmount = (amount * rates[toCurrency]).toFixed(2);
    res.render('index', { result: `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`, error: null });
  } catch (error) {
    console.error(error.message);
    res.render('index', { result: null, error: 'Failed to fetch exchange rates. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
