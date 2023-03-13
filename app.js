const express = require('express');
const app = express();

const currencies = [
    {name: "EUR", rate: 0.94},
    {name: "PLN", rate: 4.40},
    {name: "GBP", rate: 0.83},
    {name: "USD", rate: 1},
];

function isCurrency(name) {
    return currencies.some((currency) => currency.name === name);
}

app.get('/', (_, res) => {
    res.send('Hello world!');
});

app.get('/currencies', (_, res) => {
    res.send(currencies);
});

app.get('/currencies/:name', (req, res) => {
    const currency = currencies.find((currency) => currency.name === req.params.name);
    if (!currency) {
        res.status(404).send('The currency with given name was not found.');
    }
    res.send(currency);
});

app.get('/rate', (req, res) => {
    const from = (req.query.from ?? '').toUpperCase();
    if (!isCurrency(from)) {
        return res.status(404).send(`${from} is not a known currency.`);
    }

    const to = (req.query.to ?? '').toUpperCase();
    if (!isCurrency(to)) {
        return res.status(404).send(`${to} is not a known currency.`);
    }
    
    const amount = parseInt(req.query.amount, 10);
    if (!amount || amount < 0) {
        return res.status(400).send(`${amount} must be a number grater than 0`);
    }
    
    const fromCurrency = currencies.find((currency) => currency.name === from);
    const toCurrency = currencies.find((currency) => currency.name === to);

    const precision = fromCurrency.rate * amount * toCurrency.rate;
    const calculatedAmount = Math.round(precision * 100) / 100;

    const response = { from, to, amount: calculatedAmount };
    return res.send(response);
})

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
