# Plan Limits and Features

This document outlines the specific limits and features for each subscription plan offered by Zephyrn Securities.

## Plan Comparison

### 🆓 Starter Plan (Free)
- **Price**: $0 (forever)
- **File Upload Limit**: 100 MB per file
- **Daily Encryption Limit**: 3 files
- **Daily Decryption Limit**: 3 files
- **Features**:
  - Any type of file supported
  - Basic AES-256 encryption
  - Email support
  - Basic security features

### ⚡ Professional Plan
- **Price**: $19.99/month (₹1,659.17/month)
- **File Upload Limit**: 1 GB per file
- **Daily Encryption Limit**: 50 files
- **Daily Decryption Limit**: 50 files
- **Features**:
  - Any type of file supported
  - Advanced AES-256 encryption
  - Priority support
  - Encryption analytics
  - API access
  - Enhanced security features

### 👑 Enterprise Plan
- **Price**: $89.99/month (₹7,469.17/month)
- **File Upload Limit**: 10 GB per file
- **Daily Encryption Limit**: Unlimited
- **Daily Decryption Limit**: Unlimited
- **Features**:
  - Advanced threat detection
  - Military-grade encryption
  - 24/7 dedicated support
  - Advanced analytics
  - Custom integrations
  - Compliance reporting
  - Enterprise-grade security

### 🏢 Global Plan (Enterprise)
- **Price**: Custom pricing
- **File Upload Limit**: Unlimited
- **Daily Encryption Limit**: Unlimited
- **Daily Decryption Limit**: Unlimited
- **Features**:
  - Custom deployment
  - Dedicated infrastructure
  - White-label solutions
  - SLA guarantees
  - Custom security protocols
  - On-premise deployment
  - Global compliance
  - Tailored solutions

## Implementation Notes

### File Upload Limits
- Limits are enforced per individual file upload
- Users can upload multiple files within their daily limits
- File size is checked before processing begins

### Daily Operation Limits
- Encryption and decryption limits are tracked per user per day
- Limits reset at midnight UTC
- Free plan users get 3 operations total (encryption + decryption)
- Professional plan users get 50 operations each for encryption and decryption
- Enterprise plan users have unlimited operations

### Currency Conversion
- All prices are displayed in USD on the website
- Razorpay payments are processed in INR
- Conversion rate: 1 USD = 83 INR (fixed rate)
- Both USD and INR amounts are shown during checkout

### Support Levels
- **Starter**: Email support (response within 24-48 hours)
- **Professional**: Priority support (response within 4-8 hours)
- **Enterprise**: 24/7 dedicated support (response within 1-2 hours)
- **Global**: Custom SLA with dedicated account manager

## Technical Implementation

The limits are enforced through:
1. Frontend validation before file upload
2. Backend API checks for daily operation counts
3. Database tracking of user operations
4. Real-time limit checking during payment processing

## Future Enhancements

Consider implementing:
- Usage analytics dashboard for users
- Pro-rated billing for plan upgrades
- Bulk operation discounts
- Custom limit negotiations for enterprise clients 