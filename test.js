const axios = require('axios');

const testAPI = async () => {
  try {
    const response = await axios.get('http://localhost:3000/scrape', {
      params: {
        url: 'https://www.ebay.com/sch/i.html?_nkw=nike'
      },
      timeout: 60000
    });
    
    console.log('Status:', response.data.status);
    console.log('Products found:', response.data.products.length);
    console.log('Sample product:', JSON.stringify(response.data.products[0], null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testAPI();