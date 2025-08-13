const scraperService = require('../services/scraperService');

const scrapeProducts = async (req, res) => {
  try {
    const { url, page = 1 } = req.query;
    
    console.log(`Controller received: URL=${url}, Page=${page}`);
    
    if (!url || !url.includes('ebay.com')) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid eBay URL'
      });
    }

    const result = await scraperService.scrapeEbayProducts(url, parseInt(page));
    
    console.log(`Controller result: ${result.products?.length || 0} products`);
    
    res.json({
      status: 'success',
      products: result.products || [],
      currentPage: result.currentPage || page,
      hasNextPage: result.hasNextPage || false,
      nextPageUrl: result.nextPageUrl || null
    });
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { scrapeProducts };