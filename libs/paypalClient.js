const paypal = require('@paypal/checkout-server-sdk');
const { PayPalHttpClient } = require('@paypal/checkout-server-sdk/lib/core/lib');
const { development } = require('../config');

const env = development ? 
            new paypal.core.SandboxEnvironment():
            new paypal.core.SandboxEnvironment();

const client = new paypal.core.PayPalHttpClient(env)

module.exports = client