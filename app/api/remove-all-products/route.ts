// app/api/products/delete-all/route.js
import { dodopayments } from '@/lib/dodopayments/server';
import { NextResponse } from 'next/server';

// Configuration
const DELAY_BETWEEN_DELETES = 3000; // 3 seconds in milliseconds

// Utility function to create delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to log with timestamp
const log = (message, data = null) => {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
};

export async function POST(request) {
  const startTime = Date.now();
  log('Starting delete all products process');

  try {

    // Step 1: Fetch all products using the client
    log('Fetching all products...');
    const allProducts = [];
    let pageCount = 0;

    try {
      // Automatically fetches more pages as needed
      for await (const productListResponse of dodopayments.products.list()) {
        pageCount++;
        allProducts.push(productListResponse);
        log(`Fetched page ${pageCount}, found product:`, {
          product_id: productListResponse.product_id,
          name: productListResponse.name,
          business_id: productListResponse.business_id
        });
      }
    } catch (fetchError) {
      log('ERROR: Failed to fetch products', { error: fetchError.message });
      return NextResponse.json(
        { error: 'Failed to fetch products', message: fetchError.message },
        { status: 500 }
      );
    }

    log(`Total products found: ${allProducts.length}`);

    if (allProducts.length === 0) {
      log('No products found to delete');
      return NextResponse.json({
        message: 'No products found to delete',
        totalProducts: 0,
        deletedProducts: 0,
        failedDeletes: 0,
        results: [],
        executionTime: Date.now() - startTime
      });
    }

    // Step 2: Delete products with delay
    log('Starting deletion process with 3-second delays...');
    const results = [];
    let deletedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      const productInfo = {
        id: product.product_id,
        name: product.name || 'Unnamed Product',
        businessId: product.business_id
      };

      log(`Attempting to delete product ${i + 1}/${allProducts.length}`, productInfo);
      
      try {
        // Delete the product using the client
        await dodopayments.products.delete(product.product_id);
        
        const successResult = {
          success: true,
          productId: product.product_id,
          productName: product.name,
          businessId: product.business_id,
          attemptNumber: i + 1,
          status: 200,
          message: 'Product deleted successfully'
        };

        results.push(successResult);
        deletedCount++;
        
        log(`SUCCESS: Product deleted`, {
          productId: product.product_id,
          attemptNumber: i + 1
        });

      } catch (deleteError) {
        const failureResult = {
          success: false,
          productId: product.product_id,
          productName: product.name,
          businessId: product.business_id,
          attemptNumber: i + 1,
          error: deleteError.message,
          errorType: deleteError.constructor.name
        };

        results.push(failureResult);
        failedCount++;
        
        log(`FAILED: Product deletion failed`, {
          productId: product.product_id,
          error: deleteError.message,
          attemptNumber: i + 1
        });
      }

      // Add delay between deletions (except for the last one)
      if (i < allProducts.length - 1) {
        log(`Waiting ${DELAY_BETWEEN_DELETES}ms before next deletion...`);
        await delay(DELAY_BETWEEN_DELETES);
      }
    }

    // Step 3: Return summary
    const executionTime = Date.now() - startTime;
    const summary = {
      message: 'Product deletion process completed',
      totalProducts: allProducts.length,
      deletedProducts: deletedCount,
      failedDeletes: failedCount,
      executionTimeMs: executionTime,
      executionTimeFormatted: `${Math.round(executionTime / 1000)}s`,
      results: results,
      summary: {
        successRate: `${Math.round((deletedCount / allProducts.length) * 100)}%`,
        totalTimeWithDelays: `${Math.round(((allProducts.length - 1) * DELAY_BETWEEN_DELETES + executionTime) / 1000)}s`,
        averageTimePerDeletion: `${Math.round(executionTime / allProducts.length)}ms`
      }
    };

    log('Deletion process completed', {
      totalProducts: allProducts.length,
      deleted: deletedCount,
      failed: failedCount,
      executionTime: `${Math.round(executionTime / 1000)}s`
    });

    return NextResponse.json(summary);

  } catch (error) {
    const executionTime = Date.now() - startTime;
    log('ERROR: Unexpected error in delete all products', {
      error: error.message,
      stack: error.stack,
      executionTime: `${Math.round(executionTime / 1000)}s`
    });

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message,
        executionTimeMs: executionTime
      },
      { status: 500 }
    );
  }
}

// GET method to return information about the endpoint
export async function GET() {
  log('GET request to delete-all endpoint');
  
  return NextResponse.json({
    endpoint: '/api/products/delete-all',
    method: 'POST',
    description: 'Deletes all products associated with your DodoPayments account',
    configuration: {
      delayBetweenDeletes: `${DELAY_BETWEEN_DELETES}ms`,
      hasToken: !!process.env.DODO_PAYMENTS_BEARER_TOKEN
    },
    usage: 'Send a POST request to this endpoint to start the deletion process',
    warning: '⚠️  This action is irreversible. All products will be permanently deleted.',
    logs: 'Check server console for detailed execution logs'
  });
}