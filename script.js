const apiKey = '4cafc1533768323a9c7bc3ac';
const apiBaseUrl = 'https://v6.exchangerate-api.com/v6/';

// DOM Elements
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const amount = document.getElementById('amount');
const result = document.getElementById('result');
const aiAdvice = document.getElementById('aiAdvice');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');

// Fetch exchange rates and perform conversion
async function convertCurrency() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amountValue = parseFloat(amount.value);

    if (isNaN(amountValue) || amountValue <= 0) {
        result.innerHTML = 'Please enter a valid amount.';
        aiAdvice.innerHTML = '';
        return;
    }

    result.innerHTML = 'Fetching rates...';
    aiAdvice.innerHTML = '';

    try {
        const response = await fetch(`${apiBaseUrl}${apiKey}/latest/${from}`);
        const data = await response.json();

        if (data.result !== 'success') {
            throw new Error('API Error: ' + data['error-type']);
        }

        const rate = data.conversion_rates[to];
        const convertedAmount = (amountValue * rate).toFixed(2);

        result.innerHTML = `${amountValue} ${from} = ${convertedAmount} ${to}`;
        
        // Simple AI logic: Compare rate to a threshold (e.g., 1)
        const aiRecommendation = rate > 1 
            ? `The exchange rate (${rate.toFixed(2)}) is favorable! Consider exchanging now.` 
            : `The rate (${rate.toFixed(2)}) is low. You might want to wait for a better rate.`;

        aiAdvice.innerHTML = aiRecommendation;
    } catch (error) {
        result.innerHTML = 'Error fetching exchange rates.';
        aiAdvice.innerHTML = 'Unable to provide advice due to an error.';
        console.error(error);
    }
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    convertCurrency();
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);

// Initial conversion on page load
convertCurrency();