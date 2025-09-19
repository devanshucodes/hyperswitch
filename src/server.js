const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Create Payment Intent endpoint
app.post('/create-payment', async (req, res) => {
    try {
        const { amount, currency = 'USD' } = req.body;
        
        // Real Hyperswitch API integration
        const hyperswitchSecretKey = process.env.HYPERSWITCH_SECRET_KEY;
        const hyperswitchBaseUrl = process.env.HYPERSWITCH_BASE_URL || 'https://api.hyperswitch.io';
        
        if (!hyperswitchSecretKey || hyperswitchSecretKey === 'your_secret_key_here') {
            console.log('❌ HYPERSWITCH_SECRET_KEY not configured');
            res.status(400).json({ 
                error: 'Hyperswitch API key not configured',
                message: 'Please set HYPERSWITCH_SECRET_KEY in .env file'
            });
            return;
        }
        
        // Real Hyperswitch API call
        console.log('🔗 Making API call to:', `${hyperswitchBaseUrl}/payments`);
        console.log('🔑 Using API key:', `${hyperswitchSecretKey.substring(0, 20)}...`);
        
        const response = await fetch(`${hyperswitchBaseUrl}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': hyperswitchSecretKey,
                'api-version': '2023-10-27',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amount: amount * 100, // Convert to cents
                currency: currency.toUpperCase(), // Hyperswitch expects uppercase currency codes
                confirm: false,
                capture_method: 'automatic',
                description: 'Test payment for Juspay assignment'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log('❌ Hyperswitch API failed:', errorData);
            res.status(response.status).json({ 
                error: 'Hyperswitch API error',
                details: errorData,
                status: response.status
            });
            return;
        }
        
        const paymentIntent = await response.json();
        console.log('✅ Created Real Hyperswitch Payment Intent:', paymentIntent);
        
        res.json({ 
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.payment_id,
            status: paymentIntent.status
        });
        
    } catch (error) {
        console.error('❌ Error creating payment intent:', error);
        res.status(500).json({ 
            error: 'Failed to create payment intent',
            details: error.message 
        });
    }
});

// Confirm Payment endpoint
app.post('/confirm-payment', async (req, res) => {
    try {
        const { payment_intent_id, payment_method_data } = req.body;
        
        // Real Hyperswitch API integration
        const hyperswitchSecretKey = process.env.HYPERSWITCH_SECRET_KEY;
        const hyperswitchBaseUrl = process.env.HYPERSWITCH_BASE_URL || 'https://api.hyperswitch.io';
        
        if (!hyperswitchSecretKey || hyperswitchSecretKey === 'your_secret_key_here') {
            console.log('❌ HYPERSWITCH_SECRET_KEY not configured');
            res.status(400).json({ 
                error: 'Hyperswitch API key not configured',
                message: 'Please set HYPERSWITCH_SECRET_KEY in .env file'
            });
            return;
        }
        
        // Step 1: Update payment with payment method data
        const updateResponse = await fetch(`${hyperswitchBaseUrl}/payments/${payment_intent_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': hyperswitchSecretKey,
                'api-version': '2023-10-27'
            },
            body: JSON.stringify({
                payment_method: 'card',
                payment_method_data: payment_method_data || {
                    card: {
                        card_number: '4242424242424242',
                        card_exp_month: '12',
                        card_exp_year: '2025',
                        card_cvc: '123'
                    }
                }
            })
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.text();
            console.log('❌ Hyperswitch Payment Update API failed:', errorData);
            res.status(updateResponse.status).json({ 
                error: 'Hyperswitch Payment Update API error',
                details: errorData,
                status: updateResponse.status
            });
            return;
        }

        console.log('✅ Payment method updated successfully');

        // Step 2: Confirm the payment
        const response = await fetch(`${hyperswitchBaseUrl}/payments/${payment_intent_id}/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': hyperswitchSecretKey,
                'api-version': '2023-10-27'
            },
            body: JSON.stringify({})
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log('❌ Hyperswitch Payment Confirmation API failed:', errorData);
            res.status(response.status).json({ 
                error: 'Hyperswitch Payment Confirmation API error',
                details: errorData,
                status: response.status
            });
            return;
        }
        
        const result = await response.json();
        console.log('✅ Real Hyperswitch Payment confirmed:', result);
        
        res.json(result);
        
    } catch (error) {
        console.error('❌ Error confirming payment:', error);
        res.status(500).json({ 
            error: 'Failed to confirm payment',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Payment verification endpoint for reviewers
app.get('/verify-payment/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        const hyperswitchSecretKey = process.env.HYPERSWITCH_SECRET_KEY;
        const hyperswitchBaseUrl = process.env.HYPERSWITCH_BASE_URL || 'https://api.hyperswitch.io';
        
        if (!hyperswitchSecretKey || hyperswitchSecretKey === 'your_secret_key_here') {
            res.status(400).json({ 
                error: 'Hyperswitch API key not configured',
                message: 'Please set HYPERSWITCH_SECRET_KEY in .env file'
            });
            return;
        }
        
        console.log(`🔍 Verifying payment: ${paymentId}`);
        
        const response = await fetch(`${hyperswitchBaseUrl}/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'api-key': hyperswitchSecretKey,
                'api-version': '2023-10-27'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.log('❌ Payment verification failed:', errorData);
            res.status(response.status).json({ 
                error: 'Payment verification failed',
                details: errorData,
                status: response.status
            });
            return;
        }
        
        const paymentData = await response.json();
        console.log('✅ Payment verified:', paymentData.payment_id, paymentData.status);
        
        res.json({
            verification: 'success',
            payment: paymentData,
            timestamp: new Date().toISOString(),
            verified_by: 'Hyperswitch API'
        });
        
    } catch (error) {
        console.error('❌ Error verifying payment:', error);
        res.status(500).json({ 
            error: 'Failed to verify payment',
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Payment Demo: http://localhost:${PORT}`);
    console.log(`🔧 Health Check: http://localhost:${PORT}/health`);
});
