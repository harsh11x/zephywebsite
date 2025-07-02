import { NextRequest, NextResponse } from 'next/server';

const CURRENCY_MAP: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  AU: 'AUD',
  CA: 'CAD',
  SG: 'SGD',
  IN: 'INR',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  // Add more as needed
};

const BASE_CURRENCY = 'INR';

export async function POST(req: NextRequest) {
  try {
    const { countryCode, amount } = await req.json();
    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }
    let currency = BASE_CURRENCY;
    if (countryCode && CURRENCY_MAP[countryCode]) {
      currency = CURRENCY_MAP[countryCode];
    }
    if (currency === BASE_CURRENCY) {
      return NextResponse.json({ currency, convertedAmount: amount });
    }
    // Fetch conversion rate from Razorpay
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay API keys not set' }, { status: 500 });
    }
    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    const url = `https://api.razorpay.com/v1/rates?from=${BASE_CURRENCY}&to=${currency}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch conversion rate' }, { status: 500 });
    }
    const data = await res.json();
    const rate = data[`${BASE_CURRENCY}_${currency}`];
    if (!rate) {
      return NextResponse.json({ error: 'Conversion rate not available' }, { status: 500 });
    }
    const convertedAmount = (parseFloat(amount) * rate).toFixed(2);
    return NextResponse.json({ currency, convertedAmount });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 