'use strict';
const axios = require('axios');
const logger = require('./logger');

const EBAY_SANDBOX = process.env.EBAY_SANDBOX === 'true';
const EBAY_BASE_URL = EBAY_SANDBOX ? 'https://api.sandbox.ebay.com' : 'https://api.ebay.com';
const EBAY_AUTH_URL = EBAY_SANDBOX
  ? 'https://auth.sandbox.ebay.com/oauth2/authorize'
  : 'https://auth.ebay.com/oauth2/authorize';
const EBAY_TOKEN_URL = EBAY_SANDBOX
  ? 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
  : 'https://api.ebay.com/identity/v1/oauth2/token';

function getAuthorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.EBAY_APP_ID,
    redirect_uri: process.env.EBAY_REDIRECT_URI,
    response_type: 'code',
    scope: [
      'https://api.ebay.com/oauth/api_scope',
      'https://api.ebay.com/oauth/api_scope/sell.inventory',
      'https://api.ebay.com/oauth/api_scope/sell.account',
    ].join(' '),
    state,
  });
  return `${EBAY_AUTH_URL}?${params.toString()}`;
}

async function exchangeCodeForTokens(code) {
  const credentials = Buffer.from(
    `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
  ).toString('base64');

  const response = await axios.post(
    EBAY_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.EBAY_REDIRECT_URI,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
  };
}

async function refreshAccessToken(refreshToken) {
  const credentials = Buffer.from(
    `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
  ).toString('base64');

  const response = await axios.post(
    EBAY_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      scope: 'https://api.ebay.com/oauth/api_scope/sell.inventory',
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  return {
    accessToken: response.data.access_token,
    refreshToken,
    expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
  };
}

function createEbayClient(accessToken) {
  return axios.create({
    baseURL: EBAY_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    },
  });
}

async function createOrUpdateInventoryItem(accessToken, payload) {
  const client = createEbayClient(accessToken);
  const body = {
    availability: {
      shipToLocationAvailability: { quantity: payload.quantity },
    },
    condition: payload.condition || 'USED_EXCELLENT',
    description: { value: payload.description },
    product: {
      title: payload.title,
      description: payload.description,
      imageUrls: payload.imageUrls,
      aspects: payload.aspects || {},
    },
  };

  await client.put(`/sell/inventory/v1/inventory_item/${encodeURIComponent(payload.sku)}`, body);
  logger.info('eBay inventory item upserted', { sku: payload.sku });
}

async function createOffer(accessToken, payload) {
  const client = createEbayClient(accessToken);
  const body = {
    sku: payload.sku,
    marketplaceId: 'EBAY_US',
    format: 'FIXED_PRICE',
    availableQuantity: payload.quantity,
    categoryId: payload.categoryId || '177',
    pricingSummary: {
      price: { value: payload.price.toFixed(2), currency: payload.currency || 'USD' },
    },
    listingDescription: payload.description,
    merchantLocationKey: 'warehouse_main',
  };

  const response = await client.post('/sell/inventory/v1/offer', body);
  return response.data.offerId;
}

async function publishOffer(accessToken, offerId) {
  const client = createEbayClient(accessToken);
  const response = await client.post(`/sell/inventory/v1/offer/${offerId}/publish`);
  return {
    listingId: offerId,
    itemId: response.data.listingId,
    status: 'active',
    url: `https://www.ebay.com/itm/${response.data.listingId}`,
  };
}

module.exports = {
  getAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  createOrUpdateInventoryItem,
  createOffer,
  publishOffer,
};
