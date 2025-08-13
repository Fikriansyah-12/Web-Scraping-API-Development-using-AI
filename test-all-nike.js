const axios = require('axios');

const testAllNikeShoes = async () => {
  try {
    console.log('Starting to scrape ALL Nike shoes from eBay...');
    console.log('This may take several minutes...');
    
    const response = await axios.get('http://localhost:3000/scrape', {
      params: {
        url: 'https://www.ebay.com/sch/i.html?_nkw=nike+shoes&_sacat=15709'
      },
      timeout: 300000 // 5 minutes timeout
    });
    
    console.log('Status:', response.data.status);
    console.log('Total Nike shoes found:', response.data.products.length);
    
    // Group by series
    const seriesCount = {};
    response.data.products.forEach(product => {
      const series = product.series || 'Unknown';
      seriesCount[series] = (seriesCount[series] || 0) + 1;
    });
    
    console.log('\nNike Series Distribution:');
    Object.entries(seriesCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([series, count]) => {
        console.log(`${series}: ${count} products`);
      });
    
    console.log('\nSample products:');
    response.data.products.slice(0, 3).forEach((product, i) => {
      console.log(`\n${i + 1}. ${product.name}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   Series: ${product.series}`);
      console.log(`   Condition: ${product.condition}`);
    });
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testAllNikeShoes();