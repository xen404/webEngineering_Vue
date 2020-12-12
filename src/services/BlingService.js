const fetch = require('node-fetch');
const BLING_BASE_URL = 'https://web-engineering.big.tuwien.ac.at/s20/bling'

/**
 * Confirms a payment intent with Bling to execute a payment transaction.
 * 
 * @param {string} paymentIntentId The identifier of the payment intent.
 * @param {string} clientSecret The client secret of the payment intent.
 * @param {Object} card Customer credit card information.
 * @returns {boolean} Whether the payment succeeded or not.
 */
export async function confirmPaymentIntent(paymentIntentId, clientSecret, card) {
    const res = await fetch(BLING_BASE_URL + '/payment_intents/' + paymentIntentId + '/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': 167
        },
        body: JSON.stringify({
            "client_secret": clientSecret,
            "cardholder": card.cardholder,
            "cardnumber": card.number,
            "exp_month": card.exp_month,
            "exp_year": card.exp_year,
            "cvc": card.cvc
        })
    })
    
    const con = await res.json();

    return {body: con, status: res.status}
}
