import "dotenv/config"
import { AnyMap } from "./special_types";
import { PRODUCTION, PayoutCoins } from "../config/config";

const config = {
    npkey: PRODUCTION ? process.env.NP_KEY : process.env.NP_KEY_DEBUG
}

export type NormalCurrency = 'USD';
export type CryptoCurrency = 'BTC' | 'ETH' | 'LTC';
export type Currencies = NormalCurrency | CryptoCurrency;

export interface NowPaymentsCreateResponse extends AnyMap {
    payment_id?: number
    code?: string
}

export interface BalanceCurrency extends AnyMap {
    [key: string]: {
        amount: number,
        pendingAmount: number
    }
}

export interface CallbackPayment {
    payment_id: number;
    parent_payment_id: number;
    invoice_id: number | null;
    payment_status: string;
    pay_address: string;
    payin_extra_id: number | null;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    actually_paid: number;
    actually_paid_at_fiat: number;
    pay_currency: string;
    order_id: string | null;
    order_description: string | null;
    purchase_id: string;
    outcome_amount: number;
    outcome_currency: string;
    payment_extra_ids: any; // Adjust type accordingly based on actual data
    fee: {
        currency: string;
        depositFee: number;
        withdrawalFee: number;
        serviceFee: number;
    };
}

export interface WithdrawalCallback {
    id: string;
    batch_withdrawal_id: string;
    status: string;
    error: string | null;
    currency: string;
    amount: string;
    address: string;
    fee: string | null; // Adjust type accordingly based on actual data
    extra_id: string | null;
    hash: string | null;
    ipn_callback_url: string;
    created_at: string; // Date string, consider using Date type or a custom parser
    requested_at: string | null; // Date string, consider using Date type or a custom parser
    updated_at: string | null; // Date string, consider using Date type or a custom parser
}


class NowPayments {
    async createPayment(amount: number, orderId: string, crypto: CryptoCurrency): Promise<NowPaymentsCreateResponse> {
        return new Promise((res, rej) => {
            fetch('https://api.nowpayments.io/v1/payment', {
                method: 'POST',
                headers: {
                    'x-api-key': config.npkey as string, // Fuck you fetch
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'order_id': orderId,
                    'price_amount': amount,
                    'pay_currency': crypto,
                    'price_currency': 'usd',
                    'order_description': 'N/A',
                    'ipn_callback_url': 'https://api.buxdrop.com/transaction-callback',
                })
            }).then(res => res.json())
                .then(data => {
                    res(data)
                })
        })
    }

    async Payout(
        amount: number,
        address: string,
        crypto: CryptoCurrency
    ): Promise<NowPaymentsCreateResponse> {
        return new Promise((res, rej) => {
            let coin: string = crypto.toLowerCase();
            let payout_address: string | null = PayoutCoins[coin];

            fetch('https://api.nowpayments.io/v1/payout', {
                method: 'POST',
                headers: {
                    'x-api-key': config.npkey as string, // Fuck you fetch
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'address': address,
                    'price_amount': amount,
                    'pay_currency': crypto,
                    "ipn_callback_url": `https://api.buxdrop.com/withdraw-callback`,
                    "payout_address": payout_address
                })
            }).then(res => res.json())
                .then(data => {
                    res(data)
                })
        })
    }

    async getPaymentStatus(paymentId: string | number) {
        return new Promise((res, rej) => {
            fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
                method: "GET",
                headers: {
                    'x-api-key': config.npkey as string
                }
            }).then(res => res.json()).then(data => {
                res(data)
            })
        })
    }

    async getExchangeRate(amount: Number, from: Currencies, to: Currencies) {
        return new Promise((res, rej) => {
            fetch(`https://api.nowpayments.io/v1/estimate?amount=${amount}&currency_from=${from.toLowerCase()}&currency_to=${to.toLowerCase()}`, {
                method: "GET",
                headers: {
                    'x-api-key': config.npkey as string
                }
            })
                .then(res => res.json())
                .then(data => {
                    res(data)
                })
        })
    }

    async getMinimum(currency: CryptoCurrency | string) {
        return new Promise((res, rej) => {
            fetch(`https://api.nowpayments.io/v1/min-amount?currency_from=${currency}&fiat_equivalent=usd&is_fee_paid_by_user=False`, {
                method: "GET",
                headers: {
                    'x-api-key': config.npkey as string
                }
            }).then(res => res.json()).then(data => {
                res(data)
            })
        })
    }

    async getBalance(filter: boolean = false): Promise<BalanceCurrency[]> {
        return new Promise((res, rej) => {
            fetch(`https://api.nowpayments.io/v1/balance`, {
                method: "GET",
                headers: {
                    'x-api-key': config.npkey as string
                }
            })
                .then(res => res.json())
                .then(data => {
                    const ray = Object.keys(data).map(k => {
                        const c = data[k]
                        if (c.amount > 0) {
                            return c;
                        } else {
                            return null;
                        }
                    })

                    if (filter) {
                        res(ray.filter(k => {
                            return k != null
                        }))
                    } else {
                        res(ray)
                    }
                })
        })
    }

    async getCurrencies() {
        return new Promise((res, rej) => {
            fetch(`https://api.nowpayments.io/v1/currencies?fixed_rate=true`, {
                method: "GET",
                headers: {
                    'x-api-key': config.npkey as string
                }
            }).then(res => res.json()).then(data => {
                res(data)
            })
        })
    }
}

const PayGate = new NowPayments();
export default PayGate