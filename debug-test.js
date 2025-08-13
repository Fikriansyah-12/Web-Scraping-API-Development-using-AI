const axios = require('axios');
const cheerio = require('cheerio');

const debugEbayPage = async () => {
  try {
    const url = 'https://www.ebay.com/sch/i.html?_from=R40&_nkw=nike&_sacat=0&rt=nc&_pgn=1';
    
    console.log('Fetching URL:', url);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    
    console.log('Page title:', $('title').text());
    console.log('Page loaded successfully');
    
    // Check different selectors
    const selectors = ['.s-item', '.srp-results .s-item', '.srp-item', '.it-ttl'];
    
    for (const selector of selectors) {
      const count = $(selector).length;
      console.log(`${selector}: ${count} elements found`);
      
      if (count > 0) {
        $(selector).slice(0, 3).each((i, item) => {
          const $item = $(item);
          const text = $item.text().trim().substring(0, 100);
          console.log(`  ${i + 1}. ${text}...`);
        });
      }
    }
    
    // Check for Nike products specifically
    const allText = $('body').text().toLowerCase();
    const nikeCount = (allText.match(/nike/g) || []).length;
    console.log(`\nFound "nike" ${nikeCount} times on the page`);
    
  } catch (error) {
    console.error('Debug error:', error.message);
  }
};

debugEbayPage();