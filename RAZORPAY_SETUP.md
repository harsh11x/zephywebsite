# Razorpay Integration Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_d3VIQj77iWUG8r
RAZORPAY_KEY_SECRET=c00xCMjrvbF9VprzIRNIps3I
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_d3VIQj77iWUG8r

# Your existing environment variables...
```

## Features Implemented

### 1. Plan Selection Flow
- Users can select a plan from the pricing page
- Free plan users go directly to dashboard
- Paid plan users are redirected to payment page

### 2. Razorpay Integration
- **Create Order API**: `/api/payment/razorpay/create-order`
- **Verify Payment API**: `/api/payment/razorpay/verify`
- Secure payment processing with signature verification

### 3. Updated Components
- **Pricing Page**: Updated with proper plan selection
- **Auth Page**: Handles plan-based redirects
- **Payment Page**: Integrated with Razorpay checkout

### 4. Plan Details
- **Free Plan**: $0 - Starter features
- **Professional Plan**: $49/month - Advanced features
- **Enterprise Plan**: $149/month - Complete features
- **Global Plan**: Custom pricing - Contact sales

## Payment Flow

1. User selects a plan on pricing page
2. User signs up/signs in
3. For paid plans, user is redirected to payment page
4. Razorpay checkout opens
5. Payment is processed and verified
6. User is redirected to dashboard

## Security Features

- Payment signature verification
- Server-side order creation
- Client-side payment processing
- Secure environment variable handling

## Testing

Use Razorpay test cards for testing:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

## Production Setup

1. Replace test keys with production keys
2. Update webhook endpoints
3. Configure proper error handling
4. Set up subscription management
5. Implement proper user plan updates in database 