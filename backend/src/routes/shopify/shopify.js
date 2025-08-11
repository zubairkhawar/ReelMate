const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock Shopify connections (replace with Supabase in production)
let shopifyConnections = [];
let products = [];

// Validation middleware
const validateShopifyConnect = [
  body('shopDomain').isURL().withMessage('Valid shop URL is required'),
  body('accessToken').notEmpty().withMessage('Access token is required')
];

// @route   POST /api/shopify/connect
// @desc    Connect a Shopify store
// @access  Private
router.post('/connect', validateShopifyConnect, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { shopDomain, accessToken } = req.body;
    
    // In a real app, you would verify the access token with Shopify
    // For now, we'll simulate a successful connection
    
    // Check if store is already connected
    const existingConnection = shopifyConnections.find(
      conn => conn.shopDomain === shopDomain
    );
    
    if (existingConnection) {
      return res.status(400).json({
        error: 'Store already connected',
        message: 'This Shopify store is already connected to your account'
      });
    }

    // Create new connection
    const newConnection = {
      id: Date.now().toString(),
      shopDomain,
      accessToken,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      lastSync: new Date().toISOString(),
      productCount: 0
    };

    shopifyConnections.push(newConnection);

    res.status(201).json({
      message: 'Shopify store connected successfully',
      connection: {
        id: newConnection.id,
        shopDomain: newConnection.shopDomain,
        status: newConnection.status,
        connectedAt: newConnection.connectedAt
      }
    });

  } catch (error) {
    console.error('Shopify connect error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to connect Shopify store'
    });
  }
});

// @route   GET /api/shopify/connections
// @desc    Get all connected Shopify stores
// @access  Private
router.get('/connections', async (req, res) => {
  try {
    const connections = shopifyConnections.map(conn => ({
      id: conn.id,
      shopDomain: conn.shopDomain,
      status: conn.status,
      connectedAt: conn.connectedAt,
      lastSync: conn.lastSync,
      productCount: conn.productCount
    }));

    res.json({
      connections,
      total: connections.length
    });

  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch Shopify connections'
    });
  }
});

// @route   POST /api/shopify/sync-products
// @desc    Sync products from Shopify store
// @access  Private
router.post('/sync-products', async (req, res) => {
  try {
    const { shopDomain } = req.body;

    if (!shopDomain) {
      return res.status(400).json({
        error: 'Missing shop domain',
        message: 'Shop domain is required to sync products'
      });
    }

    // Check if store is connected
    const connection = shopifyConnections.find(
      conn => conn.shopDomain === shopDomain
    );

    if (!connection) {
      return res.status(400).json({
        error: 'Store not connected',
        message: 'Please connect your Shopify store first'
      });
    }

    // In a real app, you would use the Shopify API to fetch products
    // For now, we'll simulate syncing with mock data
    const mockProducts = [
      {
        id: `prod_${Date.now()}_1`,
        shopifyId: '123456789',
        title: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        currency: 'USD',
        images: [
          'https://example.com/headphones-1.jpg',
          'https://example.com/headphones-2.jpg'
        ],
        category: 'Electronics',
        tags: ['wireless', 'noise-cancelling', 'premium'],
        inventory: 50,
        status: 'active'
      },
      {
        id: `prod_${Date.now()}_2`,
        shopifyId: '987654321',
        title: 'Organic Cotton T-Shirt',
        description: 'Comfortable organic cotton t-shirt in various colors',
        price: 29.99,
        currency: 'USD',
        images: [
          'https://example.com/tshirt-1.jpg',
          'https://example.com/tshirt-2.jpg'
        ],
        category: 'Clothing',
        tags: ['organic', 'cotton', 'comfortable'],
        inventory: 100,
        status: 'active'
      }
    ];

    // Add products to our system
    const newProducts = mockProducts.map(product => ({
      ...product,
      shopDomain,
      syncedAt: new Date().toISOString()
    }));

    products.push(...newProducts);

    // Update connection last sync
    connection.lastSync = new Date().toISOString();
    connection.productCount = products.filter(p => p.shopDomain === shopDomain).length;

    res.json({
      message: 'Products synced successfully',
      syncedProducts: newProducts.length,
      totalProducts: connection.productCount,
      lastSync: connection.lastSync
    });

  } catch (error) {
    console.error('Sync products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to sync products from Shopify'
    });
  }
});

// @route   GET /api/shopify/products
// @desc    Get all synced products
// @access  Private
router.get('/products', async (req, res) => {
  try {
    const { shopDomain, category, status, limit = 50, offset = 0 } = req.query;

    let filteredProducts = [...products];

    // Filter by shop domain if provided
    if (shopDomain) {
      filteredProducts = filteredProducts.filter(p => p.shopDomain === shopDomain);
    }

    // Filter by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filter by status if provided
    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + parseInt(limit));

    res.json({
      products: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + parseInt(limit) < filteredProducts.length
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch products'
    });
  }
});

// @route   GET /api/shopify/products/:id
// @desc    Get a specific product by ID
// @access  Private
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    res.json({
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch product'
    });
  }
});

// @route   DELETE /api/shopify/connections/:id
// @desc    Disconnect a Shopify store
// @access  Private
router.delete('/connections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connectionIndex = shopifyConnections.findIndex(conn => conn.id === id);
    
    if (connectionIndex === -1) {
      return res.status(404).json({
        error: 'Connection not found',
        message: 'The requested connection does not exist'
      });
    }

    const connection = shopifyConnections[connectionIndex];
    
    // Remove connection
    shopifyConnections.splice(connectionIndex, 1);
    
    // Remove associated products
    const initialProductCount = products.length;
    products = products.filter(p => p.shopDomain !== connection.shopDomain);

    res.json({
      message: 'Shopify store disconnected successfully',
      removedProducts: initialProductCount - products.length,
      connection: {
        id: connection.id,
        shopDomain: connection.shopDomain
      }
    });

  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to disconnect Shopify store'
    });
  }
});

module.exports = router;
