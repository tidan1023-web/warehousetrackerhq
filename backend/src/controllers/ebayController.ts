import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Product } from '../models/Product';
import { createAuditLog } from '../utils/auditLogger';
import {
  getAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  createOrUpdateInventoryItem,
  createOffer,
  publishOffer,
  EbayTokens,
} from '../utils/ebayClient';
import { createError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

// In production, tokens should be stored per-user in the database (encrypted).
// This in-memory store is for demonstration — use a proper DB-backed store.
const ebayTokenStore = new Map<string, EbayTokens>();

export function getEbayAuthUrl(req: AuthRequest, res: Response): void {
  const state = uuidv4();
  const url = getAuthorizationUrl(state);
  res.json({ authUrl: url, state });
}

export async function handleEbayCallback(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code } = req.query;
    if (!code) throw createError('Authorization code missing', 400);

    const tokens = await exchangeCodeForTokens(code as string);
    ebayTokenStore.set(req.user!._id.toString(), tokens);

    await createAuditLog({
      action: 'EBAY_AUTH_CONNECTED',
      entityType: 'system',
      user: req.user!,
      details: { expiresAt: tokens.expiresAt },
      req,
    });

    res.json({ message: 'eBay account connected successfully', expiresAt: tokens.expiresAt });
  } catch (err) {
    next(err);
  }
}

async function getValidToken(userId: string): Promise<string> {
  const tokens = ebayTokenStore.get(userId);
  if (!tokens) throw createError('eBay account not connected. Please authorize first.', 401);

  if (new Date() >= tokens.expiresAt) {
    logger.info('Refreshing eBay access token', { userId });
    const refreshed = await refreshAccessToken(tokens.refreshToken);
    ebayTokenStore.set(userId, refreshed);
    return refreshed.accessToken;
  }

  return tokens.accessToken;
}

export async function syncProductToEbay(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findById(req.params.id)
      .populate('images.uploadedBy', 'name')
      .lean();
    if (!product) throw createError('Product not found', 404);

    if (product.status !== 'verified' && product.status !== 'dispatched') {
      throw createError('Only verified or dispatched products can be listed on eBay', 400);
    }

    const { price, quantity = 1, categoryId, condition } = req.body;
    if (!price || isNaN(parseFloat(price))) throw createError('Valid price is required', 400);

    const accessToken = await getValidToken(req.user!._id.toString());
    const imageUrls = product.images.map((img) => img.s3Url).slice(0, 12);
    const specs = product.specifications instanceof Map
      ? Object.fromEntries(product.specifications)
      : product.specifications as Record<string, string>;
    const aspects: Record<string, string[]> = {};
    Object.entries(specs).forEach(([k, v]) => { aspects[k] = [v]; });

    const payload = {
      sku: product.sku,
      title: `${product.name} — ${product.sku}`.substring(0, 80),
      description: `${product.description || product.name}\n\nSKU: ${product.sku}\nCategory: ${product.category}`,
      price: parseFloat(price),
      currency: 'USD',
      quantity: parseInt(quantity, 10),
      condition: condition || 'USED_EXCELLENT',
      imageUrls,
      categoryId,
      aspects,
    };

    await createOrUpdateInventoryItem(accessToken, payload);
    const offerId = await createOffer(accessToken, payload);
    const result = await publishOffer(accessToken, offerId);

    await Product.findByIdAndUpdate(product._id, {
      ebayListingId: result.listingId,
      ebayItemId: result.itemId,
      ebaySynced: true,
      ebaySyncedAt: new Date(),
    });

    await createAuditLog({
      action: 'EBAY_LISTING_CREATED',
      entityType: 'ebay_listing',
      entityId: product._id,
      user: req.user!,
      details: { sku: product.sku, listingId: result.listingId, itemId: result.itemId },
      req,
    });

    res.json({ message: 'Product listed on eBay', result });
  } catch (err) {
    next(err);
  }
}

export async function getEbayStatus(req: AuthRequest, res: Response): Promise<void> {
  const tokens = ebayTokenStore.get(req.user!._id.toString());
  res.json({
    connected: !!tokens,
    expiresAt: tokens?.expiresAt,
    isExpired: tokens ? new Date() >= tokens.expiresAt : null,
  });
}
