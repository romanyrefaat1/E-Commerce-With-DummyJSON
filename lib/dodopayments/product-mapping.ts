// lib/utils/product-mapping.js
import { dodopayments } from "@/lib/dodopayments/server";

// Cache for product mappings (in production, consider using Redis)
const productMappingCache = new Map();

/**
 * Get DodoPayments product ID from original product ID
 * @param {string|number} originalProductId - The original product ID
 * @returns {Promise<string>} - The DodoPayments product ID
 */
export async function getDodoProductId(originalProductId) {
  const originalIdStr = originalProductId.toString();
  
  // Check cache first
  if (productMappingCache.has(originalIdStr)) {
    return productMappingCache.get(originalIdStr);
  }
  
  try {
    // Search for product by original_id in metadata
    const products = await dodopayments.products.list({ limit: 100 });
    
    const matchingProduct = products.data.find(product => 
      product.metadata?.original_id === originalIdStr
    );
    
    if (matchingProduct) {
      const dodoId = matchingProduct.product_id;
      // Cache the result
      productMappingCache.set(originalIdStr, dodoId);
      return dodoId;
    }
    
    throw new Error(`No DodoPayments product found for original ID: ${originalIdStr}`);
    
  } catch (error) {
    console.error(`Failed to get DodoPayments product ID for ${originalIdStr}:`, error);
    throw error;
  }
}

/**
 * Get multiple DodoPayments product IDs at once
 * @param {Array<string|number>} originalProductIds - Array of original product IDs
 * @returns {Promise<Object>} - Mapping object { originalId: dodoId }
 */
export async function getDodoProductIds(originalProductIds) {
  const mapping = {};
  
  // Get all products once
  const products = await dodopayments.products.list({ limit: 1000 });
  
  for (const originalId of originalProductIds) {
    const originalIdStr = originalId.toString();

    
    const matchingProduct = products.items.find(product => 
      {
        console.log("product metadata", product.meta);
        console.log("product:", product)
        return product.meta?.original_id === originalIdStr
    }
    );
    
    if (matchingProduct) {
      mapping[originalIdStr] = matchingProduct.product_id;
      // Cache the result
      productMappingCache.set(originalIdStr, matchingProduct.product_id);
    } else {
      throw new Error(`No DodoPayments product found for original ID: ${originalIdStr}`);
    }
  }
  
  return mapping;
}