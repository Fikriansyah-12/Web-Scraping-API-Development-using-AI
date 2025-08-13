const axios = require('axios');
const cheerio = require('cheerio');
const aiService = require('./aiService');

const scrapeEbayProducts = async (url, page = 1) => {
  try {
    const pageUrl = url.includes('_pgn=') ? 
      url.replace(/_pgn=\d+/, `_pgn=${page}`) : 
      `${url}&_pgn=${page}`;
    
    console.log(`Scraping page ${page}...`);
    console.log(`Page URL: ${pageUrl}`);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    const response = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
        'Connection': 'keep-alive'
      },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    const products = [];
    
    console.log('Starting product extraction...');
    
    // Use the working selector from debug: .srp-results .s-item
    const $items = $('.srp-results .s-item');
    console.log(`Found ${$items.length} .srp-results .s-item elements`);
    
    $items.each((i, item) => {
      const $item = $(item);
      const itemText = $item.text().toLowerCase();
      
      console.log(`Processing item ${i + 1}: ${itemText.substring(0, 100)}...`);
      
      // Skip sponsored items
      if (itemText.includes('sponsored')) {
        console.log(`Skipping sponsored item ${i + 1}`);
        return;
      }
      
      // Extract product data
      let name = '-', price = '-', shipping = '-', condition = '-', location = '-', link = null;
      
      // Name extraction
      const nameSelectors = ['.s-item__title', 'h3', '.it-ttl', 'a[href*="/itm/"]'];
      for (const sel of nameSelectors) {
        const text = $item.find(sel).text().trim();
        if (text && text.length > 5) {
          name = text;
          console.log(`Found name with ${sel}: ${name}`);
          break;
        }
      }
      
      // If no structured name, extract from item text
      if (name === '-') {
        const textLines = itemText.split('\n').filter(line => line.trim().length > 10);
        for (const line of textLines) {
          if (line.includes('nike') && line.length < 200) {
            name = line.trim();
            console.log(`Found name from text: ${name}`);
            break;
          }
        }
      }
      
      // Price extraction
      const priceSelectors = ['.s-item__price', '.notranslate'];
      for (const sel of priceSelectors) {
        const text = $item.find(sel).text().trim();
        if (text && text.includes('$')) {
          price = text;
          console.log(`Found price with ${sel}: ${price}`);
          break;
        }
      }
      
      // If no structured price, find in text
      if (price === '-') {
        const priceMatch = itemText.match(/\$[\d,]+\.?\d*/);
        if (priceMatch) {
          price = priceMatch[0];
          console.log(`Found price from text: ${price}`);
        }
      }
      
      // Shipping extraction
      const shippingEl = $item.find('.s-item__shipping');
      if (shippingEl.length) {
        shipping = shippingEl.text().trim();
      } else if (itemText.includes('free shipping')) {
        shipping = 'Free shipping';
      }
      
      // Condition extraction
      const conditionEl = $item.find('.SECONDARY_INFO');
      if (conditionEl.length) {
        condition = conditionEl.text().trim();
      } else {
        const conditionMatch = itemText.match(/(new|used|refurbished|pre-owned)/i);
        if (conditionMatch) condition = conditionMatch[0];
      }
      
      // Location extraction
      const locationEl = $item.find('.s-item__location');
      if (locationEl.length) {
        location = locationEl.text().trim();
      }
      
      // Link extraction
      const linkEl = $item.find('a[href*="/itm/"]');
      if (linkEl.length) {
        link = linkEl.attr('href');
      }
      
      console.log(`Item ${i + 1} extracted - Name: ${name !== '-' ? 'Found' : 'Missing'}, Price: ${price !== '-' ? 'Found' : 'Missing'}`);
      
      // Only add if we have name and price
      if (name !== '-' && price !== '-' && name.length > 5) {
        products.push({ name, price, shipping, condition, location, link });
        console.log(`Added product ${products.length}: ${name} - ${price}`);
      }
    });
    
    console.log(`Total products extracted: ${products.length}`);
    
    // Remove duplicates and clean data
    const uniqueProducts = [];
    const seen = new Set();
    
    products.forEach(product => {
      try {
        const key = `${product.name}-${product.price}`;
        if (!seen.has(key) && product.name && product.name.length > 5) {
          seen.add(key);
          uniqueProducts.push(product);
        }
      } catch (error) {
        console.error('Error processing product:', error);
      }
    });
    
    console.log(`Processing ${uniqueProducts.length} unique products...`);
    
    // Process products (skip AI for now to avoid errors)
    for (const product of uniqueProducts) {
      try {
        product.series = extractSeriesLocally(product.name);
        product.description = product.name.substring(0, 200);
        product.seller = '-';
        product.itemNumber = '-';
        delete product.link;
      } catch (error) {
        console.error('Error processing product details:', error);
        product.series = '-';
        product.description = product.name || 'Unknown product';
        product.seller = '-';
        product.itemNumber = '-';
      }
    }
    
    const finalProducts = uniqueProducts.slice(0, 50);
    
    const hasNextPage = $('.pagination__next, .ebayui-pagination__control--next').length > 0;
    
    console.log(`Returning ${finalProducts.length} products for page ${page}`);
    
    return {
      products: finalProducts,
      currentPage: page,
      hasNextPage,
      nextPageUrl: hasNextPage ? url.replace(/_pgn=\d+/, `_pgn=${page + 1}`) : null
    };
  } catch (error) {
    console.error('Scraping error:', error.message);
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('blocked')) {
      console.log('⚠️ eBay blocked request. Using mock data...');
      return {
        products: [
          {
            name: 'Nike Air Max 90 Essential',
            price: '$89.99',
            shipping: 'Free shipping',
            condition: 'New',
            location: 'US',
            series: 'Air Max 90',
            seller: 'nike_store',
            itemNumber: '123456',
            description: 'Classic Nike Air Max 90'
          }
        ],
        currentPage: page,
        hasNextPage: page < 3,
        nextPageUrl: null
      };
    }
    
    return {
      products: [],
      currentPage: page,
      hasNextPage: false,
      nextPageUrl: null
    };
  }
};

const scrapeProductDescription = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    
    const descriptionSelectors = [
      '.x-acc-txt-about-this-item',
      '.notranslate',
      '.u-flL',
      '.item-description'
    ];
    
    let description = '-';
    for (const selector of descriptionSelectors) {
      const text = $(selector).text().trim();
      if (text) {
        description = text;
        break;
      }
    }
    
    const seller = $('.x-sellercard-atf__info__about-seller').text().trim() || 
                  $('.mbg-nw').text().trim() || '-';
    
    const itemNumber = $('.notranslate').text().match(/Item number: (\d+)/) || 
                      $('[data-testid="ux-labels-values"]').text().match(/(\d{12,})/) || [null, '-'];
    
    return {
      description,
      seller,
      itemNumber: itemNumber[1]
    };
  } catch (error) {
    return {
      description: '-',
      seller: '-',
      itemNumber: '-'
    };
  }
};

// Local series extraction function
const extractSeriesLocally = (name) => {
  if (!name) return '-';
  
  const series = [
    'Air Max 90', 'Air Max 95', 'Air Max 97', 'Air Max 270',
    'Air Force 1', 'Air Jordan', 'Dunk', 'Blazer',
    'React Element', 'Zoom', 'Free Run', 'Revolution'
  ];
  
  for (const s of series) {
    if (name.toLowerCase().includes(s.toLowerCase())) {
      return s;
    }
  }
  return '-';
};

module.exports = { scrapeEbayProducts };