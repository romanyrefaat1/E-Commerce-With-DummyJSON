import { dodopayments } from "@/lib/dodopayments/client";

// Simple configuration
const CONFIG = {
  BATCH_SIZE: 5,
  DELAY_MS: 2000, // 2 seconds between requests
  MAX_RETRIES: 2
};

// Simple category mapping
const getTaxCategory = (category) => {
  const categoryMap = {
    'books': 'e_book',
    'laptops': 'saas',
    'smartphones': 'saas',
    'tablets': 'saas'
  };
  return categoryMap[category] || 'digital_products';
};

// Simple retry function
const retry = async (fn, retries = CONFIG.MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.status === 429 || error.status >= 500)) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return retry(fn, retries - 1);
    }
    throw error;
  }
};

// Check if product exists and get DodoPayments ID
const getExistingProductId = async (originalId) => {
  try {
    // First try to find by original ID in metadata
    const products = await dodopayments.products.list({ limit: 100 });
    const existingProduct = products.items.find(p => 
      p.metadata?.original_id === originalId.toString()
    );
    
    if (existingProduct) {
      return existingProduct.product_id;
    }
    
    // Fallback: try direct lookup (in case you used original ID as product_id)
    await dodopayments.products.retrieve(originalId.toString());
    return originalId.toString();
  } catch (error) {
    if (error.status === 404) {
      return null; // Product doesn't exist
    }
    throw error; // Other errors
  }
};

// Create product in DodoPayments
const createProduct = async (product) => {
  // Apply discount if any
  const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
  const priceInCents = Math.round(discountedPrice * 100);
  
  // Get the first image URL or thumbnail as fallback
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.thumbnail || null;
  
  const info = {
    name: product.title,
    description: product.description || `${product.title} - ${product.category}`,
    image: imageUrl, // Add product image URL
    price: { 
      currency: 'USD', 
      discount: 0, 
      price: priceInCents, 
      purchasing_power_parity: true, 
      type: 'one_time_price' 
    },
    tax_category: getTaxCategory(product.category),
    // Store original product info for identification
    metadata: {
        // NOTICE: Storing metadata in products is not possible.
      original_id: product.id.toString(),
      category: product.category,
      brand: product.brand || '',
      sku: product.sku || '',
      original_price: product.price.toString(),
      discount_percentage: (product.discountPercentage || 0).toString(),
      thumbnail: product.thumbnail || '',
      rating: product.rating ? product.rating.toString() : '',
      stock: product.stock ? product.stock.toString() : ''
    }
  };

  console.log(`💰 Price: ${product.price} → ${discountedPrice.toFixed(2)} (${priceInCents} cents)`);
  console.log(`🏷️ Original ID: ${product.id} | Category: ${product.category}`);
  console.log(`🖼️ Image: ${imageUrl || 'No image'}`);
  console.log(`📦 Stock: ${product.stock} | Rating: ${product.rating}`);

  const result = await dodopayments.products.create(info);
  return result.product_id;
};

// Main sync function
const syncProducts = async (limit = null) => {
  console.log('🚀 Starting product sync...');
  
  // Fetch products from DummyJSON
  const response = await fetch('https://dummyjson.com/products?limit=0');
  const data = await response.json();
  
  // Apply limit only if specified
  const products = limit ? data.products.slice(0, limit) : data.products;
  
  console.log(`📦 Processing ${products.length} products`);
  
  const results = { 
    created: 0, 
    skipped: 0, 
    failed: 0,
    // Store mapping for reference
    productMapping: {}
  };
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i + 1}/${products.length}] ${product.title} (ID: ${product.id})`);
    
    try {
      // Check if already exists and get DodoPayments ID
      const existingDodoId = await getExistingProductId(product.id);
      
      if (existingDodoId) {
        console.log(`⏭️ Already exists, DodoPayments ID: ${existingDodoId}`);
        results.skipped++;
        results.productMapping[product.id] = existingDodoId;
        continue;
      }
      
      // Create product with retry
      const dodoProductId = await retry(() => createProduct(product));
      console.log(`✅ Created successfully - DodoPayments ID: ${dodoProductId}`);
      results.created++;
      results.productMapping[product.id] = dodoProductId;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      results.failed++;
    }
    
    // Simple delay between requests
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_MS));
    }
  }
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`✅ Created: ${results.created}`);
  console.log(`⏭️ Skipped: ${results.skipped}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('\n🗺️ Product ID Mapping:');
  Object.entries(results.productMapping).forEach(([originalId, dodoId]) => {
    console.log(`${originalId} → ${dodoId}`);
  });
  
  return results;
};

// API Route Handlers
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const limit = body.limit || null;
    
    console.log(`Starting sync with limit: ${limit || 'unlimited'}`);
    
    const results = await syncProducts(limit);
    
    return Response.json({
      success: true,
      message: 'Sync completed',
      data: results
    });
    
  } catch (error) {
    console.error('Sync failed:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: 'Product sync API',
    usage: 'POST to /api/sync-products with optional { "limit": 50 } or no limit for all products'
  });
}